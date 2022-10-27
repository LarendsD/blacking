import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getDataSourceConfig from '../src/data-source.config';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { SessionModule } from '../src/session/session.module';
import getSessionConfig from '../src/session/config/session.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { UsersController } from '../src/users/users.controller';
import { Users } from '../src/entities/user.entity';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { CheckEmail } from '../src/users/validation/compare-emails';
import { useContainer } from 'class-validator';
import { SessionService } from '../src/session/session.service';

describe('Session Controller (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<Users>;
  let users: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let data: Users[];
  let sessionService: SessionService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        UsersModule,
        AppModule,
        SessionModule,
        TypeOrmModule.forRoot(getDataSourceConfig()),
        TypeOrmModule.forFeature([Users]),
      ],
      providers: [AppService, UsersService, CheckEmail],
      controllers: [AppController, UsersController],
    }).compile();
    sessionService = moduleFixture.get<SessionService>(SessionService);

    users = JSON.parse(fs.readFileSync('__fixtures__/users.json', 'utf-8'));
    testData = JSON.parse(
      fs.readFileSync('__fixtures__/testData.json', 'utf-8'),
    ).users;

    usersRepo = moduleFixture.get('UsersRepository');
    data = usersRepo.create(users);

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(new ValidationPipe());
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('pug');
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    await usersRepo.insert(data);
  });

  it('login', async () => {
    await request(app.getHttpServer())
      .post('/login')
      .send(testData.login)
      .expect(201);
  });

  it('logout', async () => {
    const { access_token } = await sessionService.login(testData.sign);
    await request(app.getHttpServer())
      .post('/logout')
      .auth(access_token, { type: 'bearer' })
      .expect(302);
  });

  afterEach(async () => {
    await usersRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
