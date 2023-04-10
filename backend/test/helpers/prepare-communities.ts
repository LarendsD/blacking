import { Community } from '../../src/communities/entities/community.entity';
import { Repository } from 'typeorm';

export const prepareCommunities = (
  repo: Repository<Community>,
  communityData: Array<Record<string, unknown>>,
): Promise<Community[]> => {
  const communities = repo.create(communityData);

  return repo.save(communities);
};
