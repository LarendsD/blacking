import { Community } from '../../src/communities/entities/community.entity';
import { CommunityMember } from '../../src/community-members/entities/community-member.entity';
import { MemberRole } from '../../src/community-members/enums/member-role.enum';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareCommunityMembers = async (
  repo: Repository<CommunityMember>,
  communityData: Community[],
  userData: User[],
): Promise<CommunityMember[]> => {
  return repo.save([
    {
      communityId: communityData[0].id,
      memberId: userData[0].id,
      memberRole: MemberRole.BANHAMMER,
    },
    {
      communityId: communityData[0].id,
      memberId: userData[1].id,
      memberRole: MemberRole.VIEWER,
    },
    {
      communityId: communityData[1].id,
      memberId: userData[0].id,
      memberRole: MemberRole.VIEWER,
    },
    {
      communityId: communityData[1].id,
      memberId: userData[1].id,
      memberRole: MemberRole.VIEWER,
    },
    {
      communityId: communityData[2].id,
      memberId: userData[0].id,
      memberRole: MemberRole.BANNED,
    },
    {
      communityId: communityData[2].id,
      memberId: userData[1].id,
      memberRole: MemberRole.VIEWER,
    },
    {
      communityId: communityData[4].id,
      memberId: userData[0].id,
      memberRole: MemberRole.POSTER,
    },
    {
      communityId: communityData[5].id,
      memberId: userData[0].id,
      memberRole: MemberRole.MUTED,
    },
  ]);
};
