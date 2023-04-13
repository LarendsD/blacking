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
import { prepareCommunityMembers } from './helpers/prepare-community-members';
import { CommunityMember } from '../src/community-members/entities/community-member.entity';
import { Community } from '../src/communities/entities/community.entity';
import { prepareCommunities } from './helpers/prepare-communities';

describe('PostsController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let postsRepo: Repository<Post>;
  let communityMembersRepo: Repository<CommunityMember>;
  let communityRepo: Repository<Community>;
  let users: Array<Record<string, unknown>>;
  let posts: Array<Record<string, unknown>>;
  let communities: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let postsData: Post[];
  let communityData: Community[];
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
    communities = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/communities.json`, 'utf-8'),
    );
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).contents;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    postsRepo = dataSource.getRepository(Post);
    communityRepo = dataSource.getRepository(Community);
    communityMembersRepo = dataSource.getRepository(CommunityMember);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = await prepareUsers(usersRepo, users);
    communityData = await prepareCommunities(communityRepo, communities);
    await prepareCommunityMembers(
      communityMembersRepo,
      communityData,
      userData,
    );
    postsData = await preparePosts(postsRepo, posts, userData, communityData);

    token = prepareJwtToken(jwtService, userData[0]);
  });

  describe('get posts', () => {
    it('get all', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(body).toHaveLength(9);
    });

    it('get by id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/posts/${postsData[1].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(body).toMatchObject(testData.read.output[1]);
    });

    it('get all(community)', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/posts/community/${communityData[1].id}`)
        .query({ searchLine: '', resultMultiplyer: '1' })
        .auth(token, { type: 'bearer' })
        .expect(200);

      const { createdAt, ...expectedBody } = postsData[5];

      expect(body).toMatchObject([expectedBody]);
    });

    it('get all(community)(banned)', async () => {
      return request(app.getHttpServer())
        .get(`/posts/community/${communityData[2].id}`)
        .auth(token, { type: 'bearer' })
        .expect(403);
    });

    it('get by id(community)', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/posts/${postsData[5].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const { createdAt, ...expectedBody } = postsData[5];

      expect(body).toMatchObject(expectedBody);
    });

    it('get by id(community)(banned)', async () => {
      return request(app.getHttpServer())
        .get(`/posts/${postsData[6].id}`)
        .auth(token, { type: 'bearer' })
        .expect(403);
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

    it('in community(as poster)', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/posts')
        .auth(token, { type: 'bearer' })
        .send({ communityId: communityData[4].id, ...testData.create.input })
        .expect(201);

      expect(body).toMatchObject({
        communityId: communityData[4].id,
        authorId: userData[0].id,
        ...testData.create.output,
      });
    });

    it('in community(as banned)', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .auth(token, { type: 'bearer' })
        .send({ communityId: communityData[2].id, ...testData.create.input })
        .expect(403);
    });

    it('in community(as viewer)', async () => {
      await request(app.getHttpServer())
        .post('/posts')
        .auth(token, { type: 'bearer' })
        .send({ communityId: communityData[1].id, ...testData.create.input })
        .expect(403);
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

    it('in community(as poster)', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/posts/${postsData[7].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(200);

      expect(body).toMatchObject({
        communityId: communityData[4].id,
        authorId: userData[0].id,
        ...testData.update.output,
      });
    });

    it('in community(as viewer)', async () => {
      await request(app.getHttpServer())
        .patch(`/posts/${postsData[5].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(403);
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

    it('in community(as poster)', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postsData[7].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const post = await postsRepo.findOne({
        where: { id: postsData[7].id },
      });

      expect(post).toBeNull();
    });

    it('in community(as viewer)', async () => {
      await request(app.getHttpServer())
        .patch(`/posts/${postsData[5].id}`)
        .auth(token, { type: 'bearer' })
        .expect(403);
    });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM community_members`);
    await dataSource.query(`DELETE FROM posts`);
    await dataSource.query(`DELETE FROM communities`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
