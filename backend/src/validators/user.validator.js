import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, `Username must be at least 3 characters`)
        .optional(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});
