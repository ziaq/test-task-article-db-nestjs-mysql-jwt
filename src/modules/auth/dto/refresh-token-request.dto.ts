import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const refreshTokenRequestSchema = z
  .object({
    fingerprint: z.string(),
  })
  .strict();

export class RefreshTokenRequestDto extends createZodDto(
  refreshTokenRequestSchema,
) {}
