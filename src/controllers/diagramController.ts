import z from "zod";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  data: z
    .object({
      nodes: z.array(z.unknown()),
      edges: z.array(z.unknown()),
    })
    .optional(),
});
