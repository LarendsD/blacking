import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModule, Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import * as fs from 'fs';
import * as request from 'supertest';
import { useContainer } from 'class-validator';
import getSessionConfig from '../src/session/config/session.config';

describe('Session Controller (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let users: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
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
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).users;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    data = usersRepo.create(users);
    await usersRepo.save(data);
    token = jwtService.sign(testData.sign);
  });

  it('login', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/login`)
      .send(testData.login)
      .expect(201);

    expect(Object.keys(body)).toEqual(['access_token']);
  });

  it('logout', async () => {
    await request(app.getHttpServer())
      .post('/logout')
      .auth(token, { type: 'bearer' })
      .expect(201);
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM users;`);
  });

  afterAll(async () => {
    await app.close();
  });
});
