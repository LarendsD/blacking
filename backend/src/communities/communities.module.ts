import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityMember } from '../community-members/entities/community-member.entity';
import { CaslModule } from '../casl/casl.module';
import { CommunityMembersService } from '../community-members/community-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityMember]), CaslModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunityMembersService],
})
export class CommunitiesModule {}
