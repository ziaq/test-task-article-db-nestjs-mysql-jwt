import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    fingerprint: z.string().min(1),
  })
  .strict();

export class LoginRequestDto extends createZodDto(loginRequestSchema) {}
