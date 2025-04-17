import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const logoutResponseSchema = z
  .object({
    message: z.string(),
  })
  .strict();

export class LogoutResponseDto extends createZodDto(logoutResponseSchema) {}
