import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import getSessionConfig from '../src/session/config/session.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { User } from '../src/users/entities/user.entity';
import * as fs from 'fs';
import { DataSource, Repository } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../src/users-profile/entities/user-profile.entity';

describe('UsersProfileController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let users: Array<Record<string, unknown>>;
  let profiles: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let jwtService: JwtService;
  let token: string;
  let usersProfileRepo: Repository<UserProfile>;
  let dataSource: DataSource;
  let data: UserProfile[] = [];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    users = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/users.json`, 'utf-8'),
    );
    profiles = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/usersProfiles.json`, 'utf-8'),
    );
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).usersProfile;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    usersProfileRepo = dataSource.getRepository(UserProfile);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    await usersRepo.manager.transaction(async (transaction) => {
      await Promise.all(
        users.map(async (user, index) => {
          const saveData = transaction.create(User, user);
          await transaction.save(saveData);

          const userProfileEntity = new UserProfile();
          const userProfile = transaction.merge(
            UserProfile,
            userProfileEntity,
            profiles[index],
          );

          userProfile.user = saveData;

          const userProfileResult = await transaction.save(userProfile);

          data.push(userProfileResult);
        }),
      );
    });
    token = jwtService.sign({
      id: data[0].user.id,
      email: data[0].user.email,
      profileId: data[0].id,
    });
  });

  describe('get user profiles', () => {
    it('get many', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users-profile')
        .expect(200);

      expect(body).toMatchObject(profiles);
    });

    it('get one', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users-profile/${data[0].id}`)
        .expect(200);

      expect(response.body).toMatchObject(profiles[0]);
    });
  });

  it('create userProfile', async () => {
    const { id } = await usersProfileRepo.save(testData.create.user);

    const { body } = await request(app.getHttpServer())
      .post('/users-profile')
      .send({ userId: id, ...testData.create.input });

    expect(body).toMatchObject(testData.create.output);
  });

  describe('update user profiles', () => {
    it('unauthenticated', async () => {
      return request(app.getHttpServer())
        .patch(`/users-profile/${data[0].id}`)
        .send(testData.update.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/users-profile/${data[0].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(200);

      expect(body).toMatchObject(testData.update.output);
    });

    it('authenticated, but wrong user', async () => {
      await request(app.getHttpServer())
        .patch(`/users-profile/${data[1].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(401);
    });
  });

  describe('delete user profile', () => {
    it('unauthenticated', async () => {
      return request(app.getHttpServer())
        .delete(`/users-profile/${data[0].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/users-profile/${data[0].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const userWithDeletedProfile = await usersRepo.find({
        where: { id: data[0].user.id },
      });

      expect(userWithDeletedProfile).toEqual([]);
    });

    it('authenticated, but wrong user', async () => {
      await request(app.getHttpServer())
        .delete(`/users-profile/${data[1].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(401);
    });
  });

  afterEach(async () => {
    data = [];
    await dataSource.query(`DELETE FROM users`);
    await dataSource.query(`DELETE FROM user_profiles`);
  });

  afterAll(async () => {
    await app.close();
  });
});
