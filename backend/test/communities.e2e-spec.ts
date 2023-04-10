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
import { Community } from '../src/communities/entities/community.entity';
import { prepareUsers } from './helpers/prepare-users';
import { prepareCommunities } from './helpers/prepare-communities';
import { prepareJwtToken } from './helpers/prepare-jwt-token';

describe('CommunitiesController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let communitiesRepo: Repository<Community>;
  let users: Array<Record<string, unknown>>;
  let communities: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let userData: User[];
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

    communities = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/communities.json`, 'utf-8'),
    );

    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).communities;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    communitiesRepo = dataSource.getRepository(Community);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = await prepareUsers(usersRepo, users);

    communityData = await prepareCommunities(communitiesRepo, communities);

    token = prepareJwtToken(jwtService, userData[0]);
  });

  describe('read community', () => {
    it('read all', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/communities')
        .expect(200);

      expect(body).toMatchObject(communities);
    });

    it('read one', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/communities/${communityData[1].id}`)
        .expect(200);

      expect(body).toMatchObject(communities[1]);
    });
  });

  it('create community', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/communities`)
      .auth(token, { type: 'bearer' })
      .send(testData.create.input)
      .expect(201);

    expect(body).toMatchObject(testData.create.output);
  });

  it('update commmunity', async () => {
    const { body } = await request(app.getHttpServer())
      .patch(`/communities/${communityData[0].id}`)
      .auth(token, { type: 'bearer' })
      .send(testData.update.input)
      .expect(200);

    expect(body).toMatchObject(testData.update.output);
  });

  it('delete communtiy', async () => {
    await request(app.getHttpServer())
      .delete(`/communities/${communityData[0].id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    const deletedCommunity = await communitiesRepo.findOne({
      where: { id: communityData[0].id },
    });

    expect(deletedCommunity).toBeNull();
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM communities`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
