import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupApp(app: INestApplication) {
  // --- Global Setup ---
  app.setGlobalPrefix('api');

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
      ];

  app.enableCors({
    origin: origin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
}
