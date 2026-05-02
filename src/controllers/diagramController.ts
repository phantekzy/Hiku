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

export const getDiagram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const diagram = await prisma.diagram.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!diagram) {
      res.status(404).json({ message: "Diagram not found" });
      return;
    }
    res.json(diagram);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch diagram" });
  }
};

export const createDiagram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const diagram = await prisma.diagram.create({
      data: {
        userId: req.user!.id,
        title: "Untitled Diagram",
        data: { nodes: [], edges: [] },
      },
    });
    res.status(201).json(diagram);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create diagram" });
  }
};

export const updateDiagram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.diagram.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Diagram not found" });
      return;
    }

    const updated = await prisma.diagram.update({
      where: { id: req.params.id },
      data: { ...parsed.data } as any,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update diagram" });
  }
};

export const deleteDiagram = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const existing = await prisma.diagram.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Diagram not found" });
      return;
    }
    await prisma.diagram.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete diagram" });
  }
};
