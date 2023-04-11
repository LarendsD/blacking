import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Action } from './action.enum';
import { Injectable } from '@nestjs/common';
import { CommunityMember } from '../community-members/entities/community-member.entity';
import { MemberRole } from '../community-members/enums/member-role.enum';

type Subjects = InferSubjects<typeof CommunityMember> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForCommunityMember(communityMember: CommunityMember) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    can(Action.Read, CommunityMember);

    switch (communityMember.memberRole) {
      case MemberRole.ADMIN:
        can(Action.Update, CommunityMember);
        break;

      case MemberRole.MODERATOR:
        can(Action.Update, CommunityMember, { memberRole: MemberRole.VIEWER });
        can(Action.Update, CommunityMember, { memberRole: MemberRole.BANNED });
        can(Action.Update, CommunityMember, { memberRole: MemberRole.MUTED });
        break;
      // пишет посты!!

      case MemberRole.BANHAMMER:
        can(Action.Update, CommunityMember);
        break;

      case MemberRole.POSTER:
        break;
      // пишет посты!

      case MemberRole.BANNED:
        cannot(Action.Read, CommunityMember).because(
          'You have been banned in this community!',
        );
        break;
      // не может смотреть посты и писать комментарии

      case MemberRole.MUTED:
        break;
      // не может писать комментарии!!
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
