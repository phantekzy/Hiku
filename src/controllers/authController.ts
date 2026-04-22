import { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores",
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function signToken(payload: {
  id: string;
  email: string;
  username: string;
}): string {
  const secret = process.env.JWT_SECRET!;
  const expiresIn =
    (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    const { email, username, password } = parsed.data;

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {}
};
