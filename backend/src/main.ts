import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';
import getSessionConfig from './session/config/session.config';
import redisServer from './session/config/redis-server.config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', '..', 'frontend', 'dist'));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(getSessionConfig());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await redisServer();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
