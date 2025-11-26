import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  });

  // --- Global Setup ---
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- Start Application ---
  const port = process.env.PORT || 8080;
  // Listen on '0.0.0.0' to accept connections on all network interfaces
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  // --- Simplified Logging ---
  console.log(
    `🚀 Application is running in ${isDevelopment ? 'Development' : 'Production'} mode.`,
  );
  console.log(`   - Local:    http://localhost:${port}/api`);
  console.log(
    `   - Network:  Available on your local IP (http://<your-ip>:${port}/api)`,
  );
}

void bootstrap();
