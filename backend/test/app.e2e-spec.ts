import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import getDatabaseConfig from '../src/common/config/database.config';
import { SessionModule } from '../src/session/session.module';
import getSessionConfig from '../src/session/config/session.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        SessionModule,
        TypeOrmModule.forRoot(getDatabaseConfig()),
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('pug');
    app.use(getSessionConfig());
    await app.init();
  });

  it('Welcome page', async () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('About page', async () => {
    return request(app.getHttpServer()).get('/about').expect(200);
  });

  it('Register page', async () => {
    return request(app.getHttpServer()).get('/register').expect(200);
  });

  it('Login page', async () => {
    return request(app.getHttpServer()).get('/login').expect(200);
  });

  it('FAQ page', async () => {
    return request(app.getHttpServer()).get('/FAQ').expect(200);
  });

  it('Contacts page', async () => {
    return request(app.getHttpServer()).get('/contacts').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
