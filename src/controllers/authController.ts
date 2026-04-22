import { Request, Response } from "express";
import z from "zod";
import jwt from "jsonwebtoken";

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
