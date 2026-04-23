import z from "zod";

const upsertSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.record(z.unknown()).optional(),
});
