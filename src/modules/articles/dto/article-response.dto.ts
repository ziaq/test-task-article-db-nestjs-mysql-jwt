import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { publicUserResponseSchema } from '../../users/dto/public-user-response.dto';

export const articleResponseSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    isPublic: z.boolean(),
    tags: z.array(z.string()),
    createdAt: z.coerce.date(),
    createdByUser: publicUserResponseSchema.nullable(),
  })
  .strict();

export class ArticleResponseDto extends createZodDto(articleResponseSchema) {}
