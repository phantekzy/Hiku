import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

const upsertSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.unknown()).optional(),
});

export const getDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    res.json(docs);
  } catch (err) {}
};
