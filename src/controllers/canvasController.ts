import z from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  data: z.record(z.unknown()).optional(),
  thumbnail: z.string().optional(),
});
