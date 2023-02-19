import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';

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
        migrations: [],
      };
    case 'test':
      return {
        type: 'sqlite',
        synchronize: true,
        database: ':memory:',
        entities: [User],
      };
    default:
      return {
        type: 'sqlite',
        synchronize: true,
        database: 'backend/blacking.sqlite',
        entities: [User],
      };
  }
};
