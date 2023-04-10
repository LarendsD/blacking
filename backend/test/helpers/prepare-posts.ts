import { Post } from '../../src/posts/entities/post.entity';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const preparePosts = async (
  repo: Repository<Post>,
  postData: Array<Record<string, unknown>>,
  userData: User[],
): Promise<Post[]> => {
  return repo.save([
    {
      authorId: userData[0].id,
      ...postData[0],
    },
    {
      authorId: userData[0].id,
      ...postData[1],
    },
    {
      authorId: userData[1].id,
      ...postData[2],
    },
    {
      authorId: userData[2].id,
      ...postData[3],
    },
  ]);
};
