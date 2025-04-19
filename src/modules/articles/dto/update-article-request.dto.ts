import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateArticleRequestSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().min(1).max(10_000).optional(),
    tags: z.array(z.string().min(1).max(50)).optional(),
    isPublic: z.boolean().optional(),
  })
  .strict();

export class UpdateArticleRequestDto extends createZodDto(
  updateArticleRequestSchema,
) {}
