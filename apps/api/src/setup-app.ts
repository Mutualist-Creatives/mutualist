import { INestApplication, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

export function setupApp(app: INestApplication) {
  // --- Global Setup ---
  app.setGlobalPrefix('api');

  // Increase body limit to 50mb to prevent PayloadTooLarge errors
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- CORS Configuration ---
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
}
