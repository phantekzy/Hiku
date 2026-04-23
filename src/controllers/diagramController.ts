import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  data: z
    .object({
      nodes: z.array(z.unknown()),
      edges: z.array(z.unknown()),
    })
    .optional(),
});

export const getDiagrams = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const diagrams = await prisma.diagram.findMany({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });
    res.json(diagrams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch diagrams" });
  }
};
