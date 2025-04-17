import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { articleResponseSchema } from './article-response.dto';

export const getArticlesResponseSchema = z.array(articleResponseSchema);

export class GetArticlesResponseDto extends createZodDto(
  getArticlesResponseSchema,
) {}
