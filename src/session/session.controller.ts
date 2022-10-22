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

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @UseGuards(LocalAuthGuard)
  @Redirect('/profile')
  @UseFilters(new UnauthorizedExceptionFilter())
  @Post()
  async login(@Session() session: Record<string, any>, @Request() req) {
    const { access_token } = await this.sessionService.login(req.user);
    return (session.token = access_token);
  }

  @UseGuards(JwtAuthGuard)
  @Redirect('/')
  @Post('logout')
  async logout(@Request() req: any) {
    return req.session.destroy();
  }
}
