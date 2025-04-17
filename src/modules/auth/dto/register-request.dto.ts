import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .strict();

export class RegisterRequestDto extends createZodDto(registerRequestSchema) {}
