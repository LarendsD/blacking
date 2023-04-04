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
import { PostReaction } from '../src/reactions/entities/post-reaction.entity';
import { ReactionType } from '../src/reactions/entities/enums/reaction-type.enum';
import { SubjectType } from '../src/reactions/dto/enums/subject-type.enum';

describe('ReactionsController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let postsRepo: Repository<Post>;
  let reactionsRepo: Repository<PostReaction>;
  let users: Array<Record<string, unknown>>;
  let posts: Array<Record<string, unknown>>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let postsData: Post[];
  let reactionsData: PostReaction[];
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

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    postsRepo = dataSource.getRepository(Post);
    reactionsRepo = dataSource.getRepository(PostReaction);

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
        ...posts[0],
      },
      {
        authorId: userData[0].id,
        ...posts[1],
      },
      {
        authorId: userData[1].id,
        ...posts[2],
      },
      {
        authorId: userData[2].id,
        ...posts[3],
      },
    ]);
    reactionsData = await reactionsRepo.save([
      {
        postId: postsData[0].id,
        userId: userData[0].id,
        reactionType: ReactionType.POSITIVE,
      },
      {
        postId: postsData[1].id,
        userId: userData[1].id,
        reactionType: ReactionType.NEGATIVE,
      },
      {
        postId: postsData[0].id,
        userId: userData[2].id,
        reactionType: ReactionType.NEGATIVE,
      },
      {
        postId: postsData[2].id,
        userId: userData[0].id,
        reactionType: ReactionType.POSITIVE,
      },
    ]);

    const { id, email } = userData[0];
    token = jwtService.sign({ id, email });
  });

  it('get reactions', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/reactions/subject/${postsData[0].id}`)
      .query({ subject: SubjectType.POST })
      .expect(200);

    expect(body).toMatchObject([reactionsData[0], reactionsData[2]]);
  });

  it('get reaction', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/reactions/${reactionsData[0].id}`)
      .query({ subject: SubjectType.POST })
      .expect(200);

    expect(body).toMatchObject(reactionsData[0]);
  });

  it('create reaction', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/reactions/${postsData[2].id}`)
      .auth(token, { type: 'bearer' })
      .query({ subject: SubjectType.POST })
      .send({ reactionType: ReactionType.POSITIVE })
      .expect(201);

    expect(body).toMatchObject({
      reactionType: ReactionType.POSITIVE,
      postId: postsData[2].id,
      userId: userData[0].id,
    });
  });

  it('update reaction', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/reactions/${reactionsData[2].id}`)
      .auth(token, { type: 'bearer' })
      .query({ subject: SubjectType.POST })
      .send({ reactionType: ReactionType.POSITIVE })
      .expect(200);

    expect(body).toMatchObject({
      ...reactionsData[2],
      reactionType: ReactionType.POSITIVE,
    });
  });

  it('delete reaction', async () => {
    await request(app.getHttpServer())
      .delete(`/reactions/${reactionsData[1].id}`)
      .auth(token, { type: 'bearer' })
      .query({ subject: SubjectType.POST })
      .expect(200);

    const reaction = await reactionsRepo.findOne({
      where: { id: reactionsData[1].id },
    });

    expect(reaction).toBeNull();
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM posts_reactions`);
    await dataSource.query(`DELETE FROM posts`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
