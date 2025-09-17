import { z } from 'zod';

export const targetTypeEnum = z.enum(['facility', 'clinician']);
export const encounterSettingEnum = z.enum(['virtual', 'in_person']);

export const reviewSchema = z.object({
  targetId: z.string(),
  targetType: targetTypeEnum,
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(500),
  encounterDate: z.date(),
  encounterSetting: encounterSettingEnum,
});

export type ReviewInput = z.infer<typeof reviewSchema>;
