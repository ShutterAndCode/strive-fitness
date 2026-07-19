import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, `Username must be at least 3 characters`),
    email: z.string().email(`invalid email address`),
    password: z.string().min(8, `password must be at least 8 characters`),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(`invalid email address`),
    password: z.string().min(1, `password must be at least 8 characters`),
  }),
  params: z.object({}),
  query: z.object({}),
});
