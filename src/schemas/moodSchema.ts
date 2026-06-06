import { z } from 'zod';

export const moodEntrySchema = z.object({
  mood: z.number().int().min(1).max(5),
  triggers: z.array(z.string()).min(0).max(5),
  note: z.string().max(200, 'Keep it under 200 characters'),
  reflection: z.string().max(300, 'Keep it under 300 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type MoodEntryForm = z.infer<typeof moodEntrySchema>;
