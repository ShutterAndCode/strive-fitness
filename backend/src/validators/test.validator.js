import { z } from 'zod';

const testSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().positive('Age must be a positive number'),
  }),
  params: z.object({}),
  query: z.object({}),
});

export default testSchema;