import { Module } from '@nestjs/common';
import { CommunityMembersService } from './community-members.service';
import { CommunityMembersController } from './community-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityMember } from './entities/community-member.entity';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommunityMember]), CaslModule],
  controllers: [CommunityMembersController],
  providers: [CommunityMembersService],
})
export class CommunityMembersModule {}
