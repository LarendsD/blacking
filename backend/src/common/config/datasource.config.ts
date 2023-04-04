import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';
import { UserProfile } from '../../users-profile/entities/user-profile.entity';
import { newDb } from 'pg-mem';
import { Colleagueship } from '../../colleagueships/entities/colleagueship.entity';
import { Message } from '../../messages/entities/message.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { PostReaction } from '../../reactions/entities/post-reaction.entity';
import { CommentReaction } from '../../reactions/entities/comment-reaction.entity';

export default async (): Promise<DataSource> => {
  config();

  switch (process.env.NODE_ENV) {
    case 'production':
      return new DataSource({
        type: 'postgres',
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [`${__dirname}/entities/*.entity.{ts,js}`],
        migrations: [],
      });

    case 'test':
      const db = newDb({ autoCreateForeignKeyIndices: true });

      db.public.registerFunction({
        implementation: () => 'test',
        name: 'current_database',
      });

      db.public.registerFunction({
        name: 'version',
        implementation: () =>
          'PostgreSQL 14.2, compiled by Visual C++ build 1914, 64-bit',
      });

      const dataSource: DataSource = await db.adapters.createTypeormConnection({
        type: 'postgres',
        username: 'postgres',
        password: 'postgres',
        entities: [
          User,
          UserProfile,
          Colleagueship,
          Message,
          Post,
          Comment,
          PostReaction,
          CommentReaction,
        ],
      });

      await dataSource.synchronize();

      return dataSource;

    default:
      return new DataSource({
        type: 'postgres',
        username: 'postgres',
        password: 'postgres',
        synchronize: true,
        port: Number(process.env.DATABASE_PORT),
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [
          User,
          UserProfile,
          Colleagueship,
          Message,
          Post,
          Comment,
          PostReaction,
          CommentReaction,
        ],
      });
  }
};
