import { Request, Response } from "express";
import { z } from "zod";
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const getDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doc = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!doc) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

export const createDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doc = await prisma.document.create({
      data: { userId: req.user!.id, title: "Untitled Document", content: {} },
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create document" });
  }
};

export const updateDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const parsed = upsertSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { ...parsed.data },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update document" });
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const existing = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    await prisma.document.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};
