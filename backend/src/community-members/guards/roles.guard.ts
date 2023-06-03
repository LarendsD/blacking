import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { CommunityMember } from '../entities/community-member.entity';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { CommunityMembersService } from '../community-members.service';
import { Action } from '../../casl/action.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly communityMembersService: CommunityMembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<Action>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }

    const { params, user, body } = context.switchToHttp().getRequest();

    const communityMember =
      await this.communityMembersService.findOneByCommunityId(params, user.id);

    const ability =
      this.caslAbilityFactory.createForCommunityMember(communityMember);

    const communityMemberBody = new CommunityMember();
    communityMemberBody.memberRole = body.memberRole;

    // TODO: Проверить защиту админа не быть забаненным модератором или банхаммером!!
    return ability.can(requiredPermission, communityMemberBody);
  }
}
