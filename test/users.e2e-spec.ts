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

describe('UsersController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<Users>;
  let users: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let data: Users[];

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

    users = JSON.parse(fs.readFileSync('__fixtures__/users.json', 'utf-8'));
    testData = JSON.parse(
      fs.readFileSync('__fixtures__/testData.json', 'utf-8'),
    ).users;

    usersRepo = moduleFixture.get('UsersRepository');
    data = usersRepo.create(users);

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('pug');
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    await usersRepo.insert(data);
  });

  it('create', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(testData.create)
      .expect({})
      .expect(201);
  });

  it('read', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/users/1')
      .expect(200);
    expect(body).toMatchObject(testData.read);
  });

  it('update', async () => {
    const { body } = await request(app.getHttpServer())
      .patch('/users/1')
      .send(testData.update)
      .expect(200);
    expect(body).toMatchObject(testData.update);
  });

  it('delete', async () => {
    await request(app.getHttpServer()).delete('/users/4').expect(200);
    return request(app.getHttpServer()).get('/users/4').expect({}).expect(200);
  });

  afterEach(async () => {
    await usersRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });
});
