import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommunityMembersService } from '../community-members/community-members.service';
import { CaslModule } from '../casl/casl.module';
import { PostsService } from '../posts/posts.service';
import { CommunityMember } from '../community-members/entities/community-member.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommunityMember, Post]),
    CaslModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommunityMembersService, PostsService],
})
export class CommentsModule {}
