import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const articleResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    isPublic: z.boolean(),
    tags: z.array(z.string()).optional().nullable(),
    createdAt: z.coerce.date(),
  })
  .strict();

export class ArticleResponseDto extends createZodDto(articleResponseSchema) {}
