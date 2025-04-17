import { registerAs } from '@nestjs/config';

import { Config } from './config.types';
import { envSchema } from './env.validation';

export const CONFIG = 'config';

export const config = registerAs(CONFIG, (): Config => {
  const env = envSchema.parse(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    serverHost: env.SERVER_HOST,
    serverPort: env.SERVER_PORT,
    openApiUrl: env.OPENAPI_URL,
    clientUrl: env.CLIENT_URL,
    db: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    },
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
  };
});
