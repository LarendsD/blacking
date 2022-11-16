import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';
import * as express from 'express';
import getSessionConfig from './session/config/session.config';
import redisServer from './session/config/redis-server.config';
import * as methodOverride from 'method-override';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.useGlobalPipes(new ValidationPipe());
  app.use(getSessionConfig());
  app.use(express.static('public'));
  app.use(methodOverride('_method'));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await redisServer();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
