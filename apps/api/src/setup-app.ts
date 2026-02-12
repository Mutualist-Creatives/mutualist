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
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Define origin based on environment
  const origin = isDevelopment
    ? true // In dev, allow all origins (or reflect request origin)
    : process.env.ALLOWED_ORIGINS?.split(',') || [
        // In prod, use ENV or fall back
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ];

  app.enableCors({
    origin: origin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
}
