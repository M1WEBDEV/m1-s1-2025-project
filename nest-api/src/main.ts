import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const resourcesPath = join(process.cwd(), 'resources');
  const imagesPath = join(resourcesPath, 'images');
  if (!existsSync(resourcesPath)) {
    mkdirSync(resourcesPath);
  }
  if (!existsSync(imagesPath)) {
    mkdirSync(imagesPath, { recursive: true });
  }
  app.use('/resources', express.static(resourcesPath));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
