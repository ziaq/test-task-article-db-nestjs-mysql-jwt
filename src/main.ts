import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppConfigService } from './config/app-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  patchNestJsSwagger();

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const configService = app.get(AppConfigService);
  const config = configService.getConfig();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('test-task-article-db')
    .setDescription('API for managing articles and users')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token (JWT)',
      },
      'access-token',
    )
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
      description: 'Refresh token (httpOnly cookie)',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: config.clientUrl,
    credentials: true,
  });

  await app.listen(config.serverPort, config.serverHost);
  console.log(
    `Server is running at http://${config.serverHost}:${config.serverPort}`,
  );
}
void bootstrap();
