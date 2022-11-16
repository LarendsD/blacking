import {
  Controller,
  Post,
  UseGuards,
  Request,
  Session,
  UseFilters,
  Redirect,
} from '@nestjs/common';
import { UnauthorizedExceptionFilter } from './exceptions/validation-exception.filter';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { SessionService } from './session.service';

@Controller()
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @UseGuards(LocalAuthGuard)
  @UseFilters(new UnauthorizedExceptionFilter())
  @Redirect('/profile')
  @Post('login')
  async login(@Session() session: Record<string, any>, @Request() req) {
    const { access_token } = await this.sessionService.login(req.user);
    session.token = access_token;
    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Redirect('/')
  @Post('logout')
  async logout(@Request() req: any) {
    return req.session.destroy();
  }
}
