import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { CommunityMembersService } from '../../community-members/community-members.service';
import { Action } from 'backend/src/casl/action.enum';
import { Community } from '../entities/community.entity';

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

    const { params, user } = context.switchToHttp().getRequest();

    const communityMember =
      await this.communityMembersService.findOneByCommunityId(
        { communityId: params.id },
        user.id,
      );

    if (!communityMember) {
      return false;
    }

    const ability =
      this.caslAbilityFactory.createForCommunityMember(communityMember);

    return ability.can(requiredPermission, Community);
  }
}
