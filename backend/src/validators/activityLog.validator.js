import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// const activityTypes = [
//   "running",
//   "cycling",
//   "swimming",
//   "strength",
//   "yoga",
//   "walking",
//   "other",
// ];

export const createActivityLogSchema = z.object({
  body: z
    .object({
      activityType: z
        .string()
        .trim()
        .min(1, "Activity type is required")
        .max(50, "Activity type is too long"),
      durationMinutes: z
        .number()
        .positive("Duration must be a positive number"),
      caloriesBurned: z
        .number()
        .nonnegative("Calories burned cannot be negative"),
      loggedAt: z.string().datetime().optional(),
    })
    .strict(),
  params: z.object({}),
  query: z.object({}),
});

export const updateActivityLogSchema = z.object({
  body: z
    .object({
      activityType: z.string().optional(),
      durationMinutes: z.number().positive().optional(),
      caloriesBurned: z.number().nonnegative().optional(),
      loggedAt: z.string().datetime().optional(),
    })
    .strict(),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}),
});

export const activityLogIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: mongoIdSchema }),
  query: z.object({}),
});
