import { CommentReaction } from '../entities/comment-reaction.entity';
import { PostReaction } from '../entities/post-reaction.entity';
import { RepositoryMap } from './interfaces/repository.map.interface';

export const repositoryMap: RepositoryMap = {
  POST: {
    name: 'postReactionRepository',
    idColumn: 'postId',
    entityColumn: 'post',
    ReactionEntity: PostReaction,
  },
  COMMENT: {
    name: 'commentReactionRepository',
    idColumn: 'commentId',
    entityColumn: 'comment',
    ReactionEntity: CommentReaction,
  },
};
