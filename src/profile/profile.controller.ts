import { Controller, UseGuards, UseFilters, Get, Render } from '@nestjs/common';
import { UnauthorizedExceptionFilter } from '../exceptions/unauthorized-exception.filter';
import { JwtAuthGuard } from '../session/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Profile } from './profile.decorator';

@Controller()
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @UseFilters(new UnauthorizedExceptionFilter())
  @Get('profile')
  @Render('logged/profile')
  profilePage(@Profile() user) {
    return this.usersService.findByEmail(user.email);
  }
}
