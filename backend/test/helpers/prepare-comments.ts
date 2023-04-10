import { Post } from '../../src/posts/entities/post.entity';
import { User } from '../../src/users/entities/user.entity';
import { Comment } from '../../src/comments/entities/comment.entity';
import { Repository } from 'typeorm';

export const prepareComments = async (
  repo: Repository<Comment>,
  userData: User[],
  postData: Post[],
  commentData: Array<Record<string, unknown>>,
): Promise<Comment[]> => {
  return repo.save([
    {
      postId: postData[1].id,
      authorId: userData[0].id,
      ...commentData[2],
    },
    {
      postId: postData[0].id,
      authorId: userData[2].id,
      ...commentData[0],
    },
    {
      postId: postData[2].id,
      authorId: userData[0].id,
      ...commentData[1],
    },
  ]);
};
