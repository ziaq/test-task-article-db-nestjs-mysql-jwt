import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const accessTokenResponseSchema = z
  .object({
    accessToken: z.string(),
  })
  .strict();

export class AccessTokenResponseDto extends createZodDto(
  accessTokenResponseSchema,
) {}
