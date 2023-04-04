import { SubjectType } from '../../dto/enums/subject-type.enum';
import { CommentReaction } from '../../entities/comment-reaction.entity';
import { PostReaction } from '../../entities/post-reaction.entity';

export type RepositoryMap = {
  [key in SubjectType]: {
    name: string;
    idColumn: string;
    entityColumn: string;
    ReactionEntity: typeof CommentReaction | typeof PostReaction;
  };
};
