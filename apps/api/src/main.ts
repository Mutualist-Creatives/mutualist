import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Shared Setup ---
  setupApp(app);

  // --- Start Application ---
  const port = process.env.PORT || 8080;
  // Listen on '0.0.0.0' to accept connections on all network interfaces
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  // --- Simplified Logging ---
  const isDevelopment = process.env.NODE_ENV !== 'production';
  console.log(
    `🚀 Application is running in ${isDevelopment ? 'Development' : 'Production'} mode.`,
  );
  console.log(`   - Local:    http://localhost:${port}/api`);
  console.log(
    `   - Network:  Available on your local IP (http://<your-ip>:${port}/api)`,
  );
}

void bootstrap();
