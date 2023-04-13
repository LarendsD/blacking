import { Community } from '../../src/communities/entities/community.entity';
import { Post } from '../../src/posts/entities/post.entity';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const preparePosts = async (
  repo: Repository<Post>,
  postData: Array<Record<string, unknown>>,
  userData: User[],
  communityData?: Community[],
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
    {
      authorId: userData[0].id,
      communityId: communityData ? communityData[0].id : null,
      ...postData[2],
    },
    {
      authorId: userData[2].id,
      communityId: communityData ? communityData[1].id : null,
      ...postData[1],
    },
    {
      authorId: userData[1].id,
      communityId: communityData ? communityData[2].id : null,
      ...postData[3],
    },
    {
      authorId: userData[0].id,
      communityId: communityData ? communityData[4].id : null,
      ...postData[0],
    },
    {
      authorId: userData[2].id,
      communityId: communityData ? communityData[5].id : null,
      ...postData[1],
    },
  ]);
};
