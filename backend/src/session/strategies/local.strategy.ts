import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../session.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private sessionService: SessionService) {
    super({
      usernameField: 'email',
      profileId: true,
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.sessionService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
