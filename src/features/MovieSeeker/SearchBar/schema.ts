import { z } from 'zod';

const searchSchema = z.object({
  searchTitle: z.string(),
  selectedTitle: z.string().optional(),
  type: z.enum(['movie', 'series', 'episode']),
});

export type searchSchemaType = z.infer<typeof searchSchema>;

export default searchSchema;
