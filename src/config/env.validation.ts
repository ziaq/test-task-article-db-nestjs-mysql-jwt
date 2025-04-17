import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  SERVER_HOST: z.string(),
  SERVER_PORT: z.coerce.number(),
  OPENAPI_URL: z.string().url(),
  CLIENT_URL: z.string().url(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

export function validate(env: Record<string, unknown>) {
  const validatedEnv = envSchema.parse(env);
  return validatedEnv;
}
