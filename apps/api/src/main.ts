import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Allow all origins in development
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (isDevelopment) {
    // Development: Allow all origins (for network IP access)
    app.enableCors({
      origin: true, // Allow all origins
      credentials: true,
    });
  } else {
    // Production: Restrict to specific origins
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      credentials: true,
    });
  }

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3002;
  const host = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

  await app.listen(port, host);

  console.log(`🚀 API running on:`);
  console.log(`   - Local:   http://localhost:${port}/api`);
  console.log(`   - Network: http://${getLocalIP()}:${port}/api`);
  console.log(`   - Mode:    ${isDevelopment ? 'Development' : 'Production'}`);
}

// Helper to get local IP address
function getLocalIP(): string {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

bootstrap();
