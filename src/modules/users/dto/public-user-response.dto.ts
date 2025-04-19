import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const publicUserResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
}).strict();

export class PublicUserResponseDto extends createZodDto(publicUserResponseSchema) {}
