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
import { prepareUsers } from './helpers/prepare-users';
import { preparePosts } from './helpers/prepare-posts';
import { prepareJwtToken } from './helpers/prepare-jwt-token';

describe('PostsController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let postsRepo: Repository<Post>;
  let users: Array<Record<string, unknown>>;
  let posts: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let postsData: Post[];
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
    posts = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/contents.json`, 'utf-8'),
    );
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).contents;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    postsRepo = dataSource.getRepository(Post);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = await prepareUsers(usersRepo, users);
    postsData = await preparePosts(postsRepo, posts, userData);

    token = prepareJwtToken(jwtService, userData[0]);
  });

  describe('get posts', () => {
    it('get all', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(body).toHaveLength(4);
    });

    it('get by id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/posts/${postsData[1].id}`)
        .expect(200);

      expect(body).toMatchObject(testData.read.output[1]);
    });
  });

  describe('create post', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .send(testData.create.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/posts')
        .auth(token, { type: 'bearer' })
        .send(testData.create.input)
        .expect(201);

      expect(body).toMatchObject({
        authorId: userData[0].id,
        ...testData.create.output,
      });
    });
  });

  describe('update post', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/posts/${postsData[0].id}`)
        .send(testData.update.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/posts/${postsData[0].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(200);

      expect(body).toMatchObject(testData.update.output);
    });
  });

  describe('delete post', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postsData[1].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postsData[1].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const message = await postsRepo.findOne({
        where: { id: postsData[1].id },
      });

      expect(message).toBeNull();
    });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM posts`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
