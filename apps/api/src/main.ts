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
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const os = require('os');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const nets = os.networkInterfaces() as Record<
    string,
    Array<{ family: string; internal: boolean; address: string }>
  >;

  for (const name of Object.keys(nets)) {
    const netArray = nets[name];
    if (!netArray) continue;

    for (const net of netArray) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

void bootstrap();
