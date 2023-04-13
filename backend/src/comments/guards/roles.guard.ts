import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator';
import { CommunityMembersService } from '../../community-members/community-members.service';
import { Action } from '../../casl/action.enum';
import { PostsService } from '../../posts/posts.service';
import { Comment } from '../entities/comment.entity';

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

    const { params, user } = context.switchToHttp().getRequest();

    const post = await this.postsService.findOne(params.postId);
    if (!post.communityId) {
      return true;
    }

    const communityMember =
      await this.communityMembersService.findOneByCommunityId(
        { communityId: post.communityId },
        user.id,
      );

    if (!communityMember) {
      return false;
    }

    const ability =
      this.caslAbilityFactory.createForCommunityMember(communityMember);

    return ability.can(requiredPermission, new Comment());
  }
}
