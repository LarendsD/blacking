import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { CommunityMember } from '../entities/community-member.entity';
import { MemberRole } from '../enums/member-role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { CommunityMembersService } from '../community-members.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly communityMembersService: CommunityMembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<MemberRole[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const { params, user } = context.switchToHttp().getRequest();

    const communityMember =
      await this.communityMembersService.findOneByCommunityId(params, user.id);

    const ability =
      this.caslAbilityFactory.createForCommunityMember(communityMember);

    return requiredPermissions.every((permission) => {
      return ability.can(permission, CommunityMember);
    });
  }
}
