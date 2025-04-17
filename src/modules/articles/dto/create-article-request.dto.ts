import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createArticleRequestSchema = z
  .object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(10_000),
    tags: z.array(z.string().min(1).max(50)).min(1).nullable(),
    isPublic: z.boolean(),
  })
  .strict();

export class CreateArticleRequestDto extends createZodDto(
  createArticleRequestSchema,
) {}
