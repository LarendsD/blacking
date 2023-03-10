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

describe('UsersController (e2e)', () => {
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

  it('get users', async () => {
    await request(app.getHttpServer()).get('/users').expect(401);

    const { body } = await request(app.getHttpServer())
      .get('/users')
      .auth(token, { type: 'bearer' })
      .expect(200);

    expect(body).toMatchObject(testData.read.output);

    await request(app.getHttpServer()).get(`/users/${body[0].id}`).expect(401);

    const response = await request(app.getHttpServer())
      .get(`/users/${body[0].id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    expect(response.body).toMatchObject(testData.read.output[0]);
  });

  it('confirm and create', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/users/confirm')
      .send(testData.create.input)
      .expect(201);

    expect(Object.keys(body)).toEqual(['email', 'hash']);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ hash: body.hash })
      .expect(201);

    expect(response.body).toMatchObject(testData.create.output);

    return request(app.getHttpServer())
      .post('/users')
      .send({ hash: body.hash })
      .expect(400)
      .send({ hash: 'invalid' })
      .expect(400);
  });

  it('patch user', async () => {
    const { id, email } = data[0];

    const user = users.find((u) => u.email === email);

    await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ userId: id, ...testData.update.input })
      .expect(401);

    const { body } = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .auth(token, { type: 'bearer' })
      .send({
        userId: id,
        currPassword: user.password,
        ...testData.update.input,
      })
      .expect(200);

    expect(body).toMatchObject(testData.update.output);
  });

  it('delete user', async () => {
    const { id } = data[0];

    await request(app.getHttpServer()).delete(`/users/${id}`).expect(401);

    await request(app.getHttpServer())
      .delete(`/users/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect({});
  });

  it('recover user', async () => {
    const { email, id } = data[0];

    const { body } = await request(app.getHttpServer())
      .post(`/users/recover`)
      .send({ email, ...testData.recover })
      .expect(201);

    expect(Object.keys(body)).toEqual(['email', 'hash']);

    await request(app.getHttpServer())
      .get(`/users/recover/${body.hash}`)
      .expect(200)
      .expect({ id });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await app.close();
  });
});
