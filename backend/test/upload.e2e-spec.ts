import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';
import getSessionConfig from '../src/session/config/session.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: NestExpressApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    app.useGlobalPipes(new ValidationPipe());
    app.use(getSessionConfig());
    await app.init();
  });

  it('upload file', async () => {
    return request(app.getHttpServer())
      .post('/upload')
      .attach('file', './backend/test/__fixtures__/testData.json')
      .expect(201)
      .expect({});
  });

  it('upload image', async () => {
    return request(app.getHttpServer())
      .post('/upload/image')
      .attach('image', './backend/test/__fixtures__/files/quokka.jpeg')
      .expect(201)
      .expect({});
  });

  it('upload video', async () => {
    return request(app.getHttpServer())
      .post('/upload/video')
      .attach('video', './backend/test/__fixtures__/files/RA-NGGYU.avi')
      .expect(201)
      .expect({});
  });

  it('upload music', async () => {
    return request(app.getHttpServer())
      .post('/upload/music')
      .attach('music', './backend/test/__fixtures__/files/RA-NGGYU.mp3')
      .expect(201)
      .expect({});
  });

  afterAll(async () => {
    return app.close();
  });
});
