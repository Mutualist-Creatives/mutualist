import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { INestApplication } from '@nestjs/common';

const server = express();

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var nestApp: INestApplication | undefined;
}

export default async (req: express.Request, res: express.Response) => {
  if (!global.nestApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: ['error', 'warn'] },
    );

    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

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

    await app.init();
    global.nestApp = app;
  }

  return server(req, res);
};
