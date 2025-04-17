import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const userResponseSchema = z
  .object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .strict();

export class UserResponseDto extends createZodDto(userResponseSchema) {}
