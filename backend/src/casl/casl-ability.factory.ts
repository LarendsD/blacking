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
import { Community } from '../communities/entities/community.entity';
import { Post } from '../posts/entities/post.entity';

type Subjects =
  | InferSubjects<typeof CommunityMember | typeof Community | typeof Post>
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForCommunityMember(communityMember: CommunityMember) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Action, Subjects]>
    >(createMongoAbility);
    can(Action.Read, CommunityMember);
    can(Action.Read, Post);
    can(Action.Read, Community);

    switch (communityMember?.memberRole) {
      case MemberRole.ADMIN:
        can(Action.Delete, Community);
        can(Action.Update, Community);
        can(Action.Update, CommunityMember);
        can(Action.Manage, Post);
        break;

      case MemberRole.MODERATOR:
        can(Action.Update, CommunityMember, {
          memberRole: {
            $in: [MemberRole.MUTED, MemberRole.BANNED, MemberRole.VIEWER],
          },
        });
        can(Action.Manage, Post);
        break;

      case MemberRole.BANHAMMER:
        can(Action.Update, CommunityMember, {
          memberRole: {
            $in: [MemberRole.MUTED, MemberRole.BANNED, MemberRole.VIEWER],
          },
        });
        break;

      case MemberRole.POSTER:
        can(Action.Manage, Post);
        break;

      case MemberRole.BANNED:
        cannot(Action.Read, [CommunityMember, Post]).because(
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
