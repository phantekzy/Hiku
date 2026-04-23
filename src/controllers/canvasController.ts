import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  data: z.record(z.unknown()).optional(),
  thumbnail: z.string().optional(),
});

export const getCanvases = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const canvases = await prisma.canvas.findFirst({
      where: { userId: req.user!.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(canvases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch canvases" });
  }
};

export const getCanvas = async (req: Request, res: Response): Promise<void> => {
  try {
    const canvas = await prisma.canvas.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!canvas) {
      res.status(404).json({ message: "Canvas not found" });
      return;
    }
    res.json(canvas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch canvas" });
  }
};

export const createCanvas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const canvas = await prisma.canvas.create({
      data: { userId: req.user!.id, title: "Untitled Canvas", data: {} },
    });
    res.status(201).json(canvas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create canvas" });
  }
};

export const updateCanvas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }
    const existing = await prisma.canvas.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Canvas not found" });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update canvas" });
  }
};
