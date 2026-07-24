import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const mealTypes=["breakfast", "lunch", "snack", "dinner"]
export const createFoodLogSchema = z.object({
  body: z
    .object({
      foodName: z.string().min(1, `Food name is required`),
      calories: z.number().positive(`Calories must be a positive number`),
      mealType: z.enum(mealTypes),
      loggedAt: z.string().datetime().optional(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});
export const updateFoodLogSchema = z.object({
  body: z
    .object({
      foodName: z.string().min(1).optional(),
      calories: z.number().positive().optional(),
      mealType: z.enum(mealTypes).optional(),
      loggedAt: z.string().datetime().optional(),
    })
    .strict(),
  params:z.object({ id: mongoIdSchema }),   // actually expects and validates "id",
  query: z.object({}),
});
export const foodLogIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}),
});
