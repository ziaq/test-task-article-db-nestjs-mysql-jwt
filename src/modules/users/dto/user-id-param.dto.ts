import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export class UserIdParamDto extends createZodDto(userIdParamSchema) {}
