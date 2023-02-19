import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from '../../app.module';
import { Transport } from '@nestjs/microservices';

export default async () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      const redis = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
          transport: Transport.REDIS,
          options: {
            host: 'localhost',
            port: 6379,
          },
        },
      );
      return redis.listen();
    default:
      return 'No db storage for session specified!';
  }
};
