import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { CommentReaction } from './entities/comment-reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostReaction, CommentReaction])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
