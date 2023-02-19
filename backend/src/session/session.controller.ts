import { Controller, Post, UseGuards, Request, Session } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionService } from './session.service';

@Controller()
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Session() session: Record<string, any>, @Request() req) {
    const { access_token } = await this.sessionService.login(req.user);
    session.token = access_token;
    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return req.session.destroy();
  }
}
