import { Request, Response } from "express";
import z from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  data: z.record(z.unknown()).optional(),
  thumbnail: z.string().optional(),
});

export const getCanvases = async (
  req: Request,
  res: Response,
): Promise<void> => {};
