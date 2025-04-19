import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const myProfileResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
}).strict();

export class MyProfileResponseDto extends createZodDto(myProfileResponseSchema) {}
