import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '../casl/casl.module';
import { CommunityMembersService } from '../community-members/community-members.service';
import { CommunityMember } from '../community-members/entities/community-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, CommunityMember]), CaslModule],
  controllers: [PostsController],
  providers: [PostsService, CommunityMembersService],
})
export class PostsModule {}
