import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { CommunityMembersService } from '../../community-members/community-members.service';
import { Action } from '../../casl/action.enum';
import { Post } from '../entities/post.entity';
import { PostsService } from '../posts.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly communityMembersService: CommunityMembersService,
    private readonly postsService: PostsService,
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

    if (params.id) {
      return this.checkById(params.id, user.id, requiredPermission);
    }

    const communityId = params.communityId ?? body.communityId;

    if (communityId) {
      return this.check(communityId, user.id, requiredPermission);
    }

    return true;
  }

  private async checkById(id: number, userId: number, action: Action) {
    const post = await this.postsService.findOne(id);
    if (!post.communityId) {
      return post.authorId === userId; // TODO: Проверить эту строку и может ли модератор или постер в сообществе удалить пост от другого модера или постера
    }

    return this.check(post.communityId, userId, action);
  }

  private async check(communityId: number, userId: number, action: Action) {
    const communityMember =
      await this.communityMembersService.findOneByCommunityId(
        { communityId },
        userId,
      );

    if (!communityMember) {
      return false;
    }

    const ability =
      this.caslAbilityFactory.createForCommunityMember(communityMember);

    return ability.can(action, Post);
  }
}
