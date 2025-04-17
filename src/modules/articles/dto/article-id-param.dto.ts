import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const articleIdParamSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export class ArticleIdParamDto extends createZodDto(articleIdParamSchema) {}
