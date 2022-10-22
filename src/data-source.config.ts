import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { Users } from './entities/user.entity';
import { migrations1666008357637 } from './migrations/1666008357637-migrations';

export default (): DataSourceOptions => {
  config();

  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        type: 'postgres',
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [`${__dirname}/entities/*.entity.{ts,js}`],
        migrations: [migrations1666008357637],
      };
    case 'test':
      return {
        type: 'sqlite',
        synchronize: true,
        database: ':memory:',
        entities: [Users],
        migrations: [migrations1666008357637],
      };
    default:
      return {
        type: 'sqlite',
        database: 'blacking.sqlite',
        entities: [Users],
        migrations: [migrations1666008357637],
      };
  }
};
