import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createUserRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
  })
  .strict();

export class CreateUserRequestDto extends createZodDto(
  createUserRequestSchema,
) {}
