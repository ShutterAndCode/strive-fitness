import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(3, `Username must be at least 3 characters`)
        .optional(),
      dailyCalorieGoal: z
        .number()
        .positive(`Daily calorie goal must be a positive number`)
        .optional(),
      age: z.number().int().min(13).max(120).optional(),
      height: z.number().positive().optional(),
      weight: z.number().positive().optional(),
      goal: z.enum(["lose", "maintain", "gain"]).optional(),
      dailyCalorieIntake: z.number().nonnegative().optional(),
      dailyCalorieBurn: z.number().nonnegative().optional(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});
