import { z } from 'zod';

const searchSchema = z.object({
  searchTitle: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Movie titles can only contain letters, numbers and spaces',
    })
    .min(1, {
      message: 'Please enter a movie title',
    })
    .max(100, {
      message: 'Movie title should be under 100 characters',
    }),
  selectedTitle: z.string(),
  type: z.enum(['movie', 'series', 'episode']),
});

export type searchSchemaType = z.infer<typeof searchSchema>;

export default searchSchema;
