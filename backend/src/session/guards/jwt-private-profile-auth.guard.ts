import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtPrivateProfileAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest();
    if (err || user?.profileId != params.id) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
