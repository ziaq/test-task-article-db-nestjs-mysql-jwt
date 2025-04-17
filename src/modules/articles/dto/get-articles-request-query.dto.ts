import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const getArticlesRequestQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100),
    offset: z.coerce.number().int().min(0),
    sort: z.enum(['ASC', 'DESC']),
  })
  .strict();

export class GetArticlesRequestQueryDto extends createZodDto(
  getArticlesRequestQuerySchema,
) {}
