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

describe('ColleagueshipController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let colleagueshipRepo: Repository<Colleagueship>;
  let users: Array<Record<string, unknown>>;
  let moduleFixture: TestingModule;
  let data: User[];
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
    data = usersRepo.create(users);
    await usersRepo.save(data);
    await colleagueshipRepo.save([
      {
        colleagueId: data[1].id,
        userId: data[0].id,
        status: ColleagueshipStatus.PENDING,
      },
      {
        colleagueId: data[0].id,
        userId: data[1].id,
        status: ColleagueshipStatus.PENDING,
      },
      {
        colleagueId: data[1].id,
        userId: data[2].id,
        status: ColleagueshipStatus.APPROVED,
      },
      {
        colleagueId: data[2].id,
        userId: data[1].id,
        status: ColleagueshipStatus.APPROVED,
      },
    ]);
    const { id, email } = data[0];
    token = jwtService.sign({ id, email });
  });

  describe('get colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer()).get('/colleagueship').expect(401);

      const { body } = await request(app.getHttpServer())
        .get(`/colleagueship/${data[1].id}`)
        .expect(200);

      expect(body).toMatchObject([
        {
          userId: data[1].id,
          colleagueId: data[2].id,
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
          userId: data[0].id,
          colleagueId: data[1].id,
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
        .send({ colleagueId: data[2].id })
        .expect(201);

      expect(body).toMatchObject({
        userId: data[0].id,
        colleagueId: data[2].id,
        status: ColleagueshipStatus.PENDING,
      });

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: data[0].id, userId: data[2].id },
      });

      expect(colleague).toMatchObject({
        userId: data[2].id,
        colleagueId: data[0].id,
        status: ColleagueshipStatus.PENDING,
      });
    });
  });

  describe('update colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/colleagueship/${data[1].id}`)
        .expect(401);
    });
    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/colleagueship/${data[1].id}`)
        .auth(token, { type: 'bearer' })
        .send({ status: ColleagueshipStatus.APPROVED })
        .expect(200);

      expect(body).toMatchObject({
        userId: data[0].id,
        colleagueId: data[1].id,
        status: ColleagueshipStatus.APPROVED,
      });

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: data[0].id, userId: data[1].id },
      });

      expect(colleague).toMatchObject({
        userId: data[1].id,
        colleagueId: data[0].id,
        status: ColleagueshipStatus.APPROVED,
      });
    });
  });

  describe('delete colleagueship', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/colleagueship/${data[1].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/colleagueship/${data[1].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const colleague = await colleagueshipRepo.findOne({
        where: { colleagueId: data[0].id, userId: data[1].id },
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
