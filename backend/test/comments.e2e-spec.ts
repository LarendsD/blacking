import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import getSessionConfig from '../src/session/config/session.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { User } from '../src/users/entities/user.entity';
import * as fs from 'fs';
import { DataSource, Repository } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Post } from '../src/posts/entities/post.entity';
import { Comment } from '../src/comments/entities/comment.entity';

describe('CommentsController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let postsRepo: Repository<Post>;
  let commentsRepo: Repository<Comment>;
  let users: Array<Record<string, unknown>>;
  let contents: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let postsData: Post[];
  let commentsData: Comment[];
  let jwtService: JwtService;
  let token: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    users = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/users.json`, 'utf-8'),
    );
    contents = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/contents.json`, 'utf-8'),
    );
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).contents;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    postsRepo = dataSource.getRepository(Post);
    commentsRepo = dataSource.getRepository(Comment);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = usersRepo.create(users);
    await usersRepo.save(userData);
    postsData = await postsRepo.save([
      {
        authorId: userData[0].id,
        ...contents[0],
      },
      {
        authorId: userData[0].id,
        ...contents[1],
      },
      {
        authorId: userData[1].id,
        ...contents[2],
      },
      {
        authorId: userData[2].id,
        ...contents[3],
      },
    ]);

    commentsData = await commentsRepo.save([
      {
        postId: postsData[1].id,
        authorId: userData[0].id,
        ...contents[2],
      },
      {
        postId: postsData[0].id,
        authorId: userData[2].id,
        ...contents[0],
      },
      {
        postId: postsData[2].id,
        authorId: userData[0].id,
        ...contents[1],
      },
    ]);

    const { id, email } = userData[0];
    token = jwtService.sign({ id, email });
  });

  describe('get comments', () => {
    it('get all by postId', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/comments/post/${postsData[0].id}`)
        .expect(200);

      expect(body).toMatchObject([testData.read.output[0]]);
    });

    it('get by id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/comments/${commentsData[1].id}`)
        .expect(200);

      expect(body).toMatchObject(testData.read.output[0]);
    });
  });

  describe('create comment', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .post(`/comments/${postsData[1].id}`)
        .send(testData.create.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .post(`/comments/${postsData[1].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.create.input)
        .expect(201);

      expect(body).toMatchObject({
        authorId: userData[0].id,
        postId: postsData[1].id,
        ...testData.create.output,
      });
    });
  });

  describe('update comment', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/comments/${commentsData[2].id}`)
        .send(testData.update.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/comments/${commentsData[2].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(200);

      expect(body).toMatchObject(testData.update.output);
    });
  });

  describe('delete comment', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/comments/${commentsData[0].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/comments/${commentsData[0].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const message = await postsRepo.findOne({
        where: { id: commentsData[0].id },
      });

      expect(message).toBeNull();
    });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM comments`);
    await dataSource.query(`DELETE FROM posts`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
