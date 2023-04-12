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
import { Community } from '../src/communities/entities/community.entity';
import { prepareUsers } from './helpers/prepare-users';
import { prepareCommunities } from './helpers/prepare-communities';
import { prepareJwtToken } from './helpers/prepare-jwt-token';
import { CommunityMember } from '../src/community-members/entities/community-member.entity';
import { prepareCommunityMembers } from './helpers/prepare-community-members';
import { MemberRole } from '../src/community-members/enums/member-role.enum';

describe('CommunityMembersController (e2e)', () => {
  let app: NestExpressApplication;
  let usersRepo: Repository<User>;
  let communitiesRepo: Repository<Community>;
  let communityMembersRepo: Repository<CommunityMember>;
  let users: Array<Record<string, unknown>>;
  let communities: Array<Record<string, unknown>>;
  let moduleFixture: TestingModule;
  let userData: User[];
  let communityData: Community[];
  let communityMembersData: CommunityMember[];
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

    communities = JSON.parse(
      fs.readFileSync(`${__dirname}/__fixtures__/communities.json`, 'utf-8'),
    );

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    dataSource = moduleFixture.get(getDataSourceToken());
    usersRepo = dataSource.getRepository(User);
    communitiesRepo = dataSource.getRepository(Community);
    communityMembersRepo = dataSource.getRepository(CommunityMember);

    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(getSessionConfig());
    await app.init();
  });

  beforeEach(async () => {
    userData = await prepareUsers(usersRepo, users);
    communityData = await prepareCommunities(communitiesRepo, communities);
    communityMembersData = await prepareCommunityMembers(
      communityMembersRepo,
      communityData,
      userData,
    );

    token = prepareJwtToken(jwtService, userData[0]);
  });

  describe('read', () => {
    it('by community id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/community-members/community/${communityData[0].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const [equalCommunity1, equalCommunity2] = communityMembersData;

      expect(body).toMatchObject([
        {
          communityId: equalCommunity1.communityId,
          memberId: equalCommunity1.memberId,
          memberRole: equalCommunity1.memberRole,
        },
        {
          communityId: equalCommunity2.communityId,
          memberId: equalCommunity2.memberId,
          memberRole: equalCommunity2.memberRole,
        },
      ]);
    });

    it('by community id(banned)', async () => {
      return request(app.getHttpServer())
        .get(`/community-members/community/${communityData[2].id}`)
        .auth(token, { type: 'bearer' })
        .expect(403);
    });

    it('by id', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/community-members/${communityMembersData[1].id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const [, equalCommunity] = communityMembersData;

      expect(body).toMatchObject({
        communityId: equalCommunity.communityId,
        memberId: equalCommunity.memberId,
        memberRole: equalCommunity.memberRole,
      });
    });

    it('by id(banned)', async () => {
      return request(app.getHttpServer())
        .get(`/community-members/${communityMembersData[4].id}`)
        .auth(token, { type: 'bearer' })
        .expect(403);
    });
  });

  it('create', async () => {
    const { body } = await request(app.getHttpServer())
      .post(`/community-members/${communityData[3].id}`)
      .auth(token, { type: 'bearer' })
      .expect(201);

    expect(body).toMatchObject({ memberRole: MemberRole.VIEWER });
  });

  describe('update', () => {
    it('as banhammer', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/community-members/${communityMembersData[1].id}`)
        .auth(token, { type: 'bearer' })
        .send({ memberRole: MemberRole.BANNED })
        .expect(200);

      expect(body).toMatchObject({ memberRole: MemberRole.BANNED });
    });

    it('as viewer', async () => {
      return request(app.getHttpServer())
        .patch(`/community-members/${communityMembersData[3].id}`)
        .auth(token, { type: 'bearer' })
        .send({ memberRole: MemberRole.BANNED })
        .expect(403);
    });
  });

  it('delete', async () => {
    await request(app.getHttpServer())
      .delete(`/community-members/${communityMembersData[0].id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    const deletedCommunityMember = await communityMembersRepo.findOne({
      where: { id: communityMembersData[0].id },
    });

    expect(deletedCommunityMember).toBeNull();
  });

  afterEach(async () => {
    await dataSource.query(`DELETE FROM community_members`);
    await dataSource.query(`DELETE FROM communities`);
    return dataSource.query(`DELETE FROM users`);
  });

  afterAll(async () => {
    await dataSource.destroy();
    return app.close();
  });
});
