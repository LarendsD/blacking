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
import { Colleagueship } from '../src/colleagueships/entities/colleagueship.entity';
import { ColleagueshipStatus } from '../src/colleagueships/entities/enums/colleagueship-status.enum';
import { prepareColleagueship } from './helpers/prepare-colleagueships';
import { prepareUsers } from './helpers/prepare-users';
import { prepareJwtToken } from './helpers/prepare-jwt-token';

describe('ColleagueshipController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let colleagueshipRepo: Repository<Colleagueship>;
  let users: Array<Record<string, unknown>>;
  let moduleFixture: TestingModule;
  let userData: User[];
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

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    colleagueshipRepo = dataSource.getRepository(Colleagueship);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = await prepareUsers(usersRepo, users);
    await prepareColleagueship(colleagueshipRepo, userData);
    token = prepareJwtToken(jwtService, userData[0]);
  });

  describe('get colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer()).get('/colleagueship').expect(401);

      const { body } = await request(app.getHttpServer())
        .get(`/colleagueship/${userData[1].id}`)
        .expect(200);

      expect(body).toMatchObject([
        {
          userId: userData[1].id,
          colleagueId: userData[2].id,
          status: ColleagueshipStatus.APPROVED,
        },
      ]);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/colleagueship')
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(body).toMatchObject([
        {
          userId: userData[0].id,
          colleagueId: userData[1].id,
          status: ColleagueshipStatus.PENDING,
        },
      ]);
    });
  });

  describe('create colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer()).post('/colleagueship').expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/colleagueship')
        .auth(token, { type: 'bearer' })
        .send({ colleagueId: userData[2].id })
        .expect(201);

      expect(body).toMatchObject({
        userId: userData[0].id,
        colleagueId: userData[2].id,
        status: ColleagueshipStatus.PENDING,
      });

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: userData[0].id, userId: userData[2].id },
      });

      expect(colleague).toMatchObject({
        userId: userData[2].id,
        colleagueId: userData[0].id,
        status: ColleagueshipStatus.PENDING,
      });
    });
  });

  describe('update colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/colleagueship/${userData[1].id}`)
        .expect(401);
    });
    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/colleagueship/${userData[1].id}`)
        .auth(token, { type: 'bearer' })
        .send({ status: ColleagueshipStatus.APPROVED })
        .expect(200);

      expect(body).toMatchObject({
        userId: userData[0].id,
        colleagueId: userData[1].id,
        status: ColleagueshipStatus.APPROVED,
      });

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: userData[0].id, userId: userData[1].id },
      });

      expect(colleague).toMatchObject({
        userId: userData[1].id,
        colleagueId: userData[0].id,
        status: ColleagueshipStatus.APPROVED,
      });
    });
  });

  describe('delete colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/colleagueship/${userData[1].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/colleagueship/${userData[1].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: userData[0].id, userId: userData[1].id },
      });

      expect(colleague).toBeNull();
    });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM colleagueships`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
