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

          return transaction.save(userProfile);
        }),
      );
    });
    token = jwtService.sign({ id: 1, email: 'undefined@mail.ru' });
  });

  it('get userProfiles', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users-profile')
      .expect(200);

    expect(body).toMatchObject(profiles);

    const response = await request(app.getHttpServer())
      .get(`/users-profile/${body[0].id}`)
      .expect(200);

    expect(response.body).toMatchObject(profiles[0]);
  });

  it('create userProfile', async () => {
    const { id } = await usersProfileRepo.save(testData.create.user);

    const { body } = await request(app.getHttpServer())
      .post('/users-profile')
      .send({ userId: id, ...testData.create.input });

    expect(body).toMatchObject(testData.create.output);
  });

  it('update usersProfile', async () => {
    const { id } = (
      await usersProfileRepo.find({ select: { id: true } })
    ).shift();

    await request(app.getHttpServer())
      .patch(`/users-profile/${id}`)
      .send(testData.update.input)
      .expect(401);

    const { body } = await request(app.getHttpServer())
      .patch(`/users-profile/${id}`)
      .auth(token, { type: 'bearer' })
      .send(testData.update.input)
      .expect(200);

    expect(body).toMatchObject(testData.update.output);
  });

  it('delete usersProfile', async () => {
    const { id, user } = (
      await usersProfileRepo.find({
        select: { id: true },
        relations: { user: true },
      })
    ).shift();

    await request(app.getHttpServer())
      .delete(`/users-profile/${id}`)
      .send(testData.update.input)
      .expect(401);

    await request(app.getHttpServer())
      .delete(`/users-profile/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    const userWithDeletedProfile = await usersRepo.find({
      where: { id: user.id },
    });

    expect(userWithDeletedProfile).toEqual([]);
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM users`);
    await dataSource.query(`DELETE FROM user_profiles`);
  });

  afterAll(async () => {
    await app.close();
  });
});
