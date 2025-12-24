import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';

let app: INestApplication;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    setupApp(app);
    await app.init();
  }
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}
