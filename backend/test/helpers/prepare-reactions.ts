import { Post } from '../../src/posts/entities/post.entity';
import { ReactionType } from '../../src/reactions/entities/enums/reaction-type.enum';
import { PostReaction } from '../../src/reactions/entities/post-reaction.entity';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareReactions = async (
  repo: Repository<PostReaction>,
  postData: Post[],
  userData: User[],
): Promise<PostReaction[]> => {
  return repo.save([
    {
      postId: postData[0].id,
      userId: userData[0].id,
      reactionType: ReactionType.POSITIVE,
    },
    {
      postId: postData[1].id,
      userId: userData[1].id,
      reactionType: ReactionType.NEGATIVE,
    },
    {
      postId: postData[0].id,
      userId: userData[2].id,
      reactionType: ReactionType.NEGATIVE,
    },
    {
      postId: postData[2].id,
      userId: userData[0].id,
      reactionType: ReactionType.POSITIVE,
    },
  ]);
};
