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
import { Message } from '../src/messages/entities/message.entity';

describe('ColleagueshipController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let messagesRepo: Repository<Message>;
  let users: Array<Record<string, unknown>>;
  let messages: Array<Record<string, unknown>>;
  let testData: Record<string, any>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let messageData: Message[];
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
    messages = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/messages.json`, 'utf-8'),
    );
    testData = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/testData.json`, 'utf-8'),
    ).messages;

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    messagesRepo = dataSource.getRepository(Message);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = usersRepo.create(users);
    await usersRepo.save(userData);
    messageData = await messagesRepo.save([
      {
        senderId: userData[0].id,
        addresseeId: userData[1].id,
        ...messages[0],
      },
      {
        senderId: userData[0].id,
        addresseeId: userData[2].id,
        ...messages[1],
      },
      {
        senderId: userData[1].id,
        addresseeId: userData[2].id,
        ...messages[2],
      },
      {
        senderId: userData[2].id,
        addresseeId: userData[0].id,
        ...messages[3],
      },
    ]);
    const { id, email } = userData[0];
    token = jwtService.sign({ id, email });
  });

  describe('get messages', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer()).get('/messages').expect(401);
    });

    it('authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/messages')
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(response.body).toMatchObject(testData.read.output);
    });

    it('by id(unauthenticated)', async () => {
      await request(app.getHttpServer())
        .get(`/messages/${messageData[0].id}`)
        .expect(401);
    });

    it('by id(authenticated)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/messages/${messageData[0].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(response.body).toMatchObject(testData.read.output[0]);
    });
  });

  describe('create message', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .send({ addresseeId: userData[1].id, ...testData.create.input })
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/messages')
        .auth(token, { type: 'bearer' })
        .send({ addresseeId: userData[1].id, ...testData.create.input })
        .expect(201);

      expect(body).toMatchObject({
        senderId: userData[0].id,
        ...testData.create.output,
      });
    });
  });

  describe('update message', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .patch(`/messages/${messageData[0].id}`)
        .send(testData.update.input)
        .expect(401);
    });

    it('authenticated', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/messages/${messageData[0].id}`)
        .auth(token, { type: 'bearer' })
        .send(testData.update.input)
        .expect(200);

      expect(body).toMatchObject(testData.update.output);
    });
  });

  describe('delete message', () => {
    it('unauthenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/messages/${messageData[0].id}`)
        .expect(401);
    });

    it('authenticated', async () => {
      await request(app.getHttpServer())
        .delete(`/messages/${messageData[0].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const message = await messagesRepo.findOne({
        where: { id: messageData[0].id },
      });

      expect(message).toBeNull();
    });
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM messages`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
