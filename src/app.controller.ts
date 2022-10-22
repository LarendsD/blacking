import {
  Controller,
  Get,
  Render,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './session/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from './session/exceptions/forbidden-exception.filter';
import { SessionGuard } from './session/guards/session.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private usersService: UsersService,
  ) {}

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get()
  @Render('welcome')
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get('about')
  @Render('info/about')
  getAbout() {
    return this.appService.getAbout();
  }

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get('contacts')
  @Render('info/contacts')
  getContacts() {
    return this.appService.getContacts();
  }

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get('FAQ')
  @Render('info/faq')
  getFAQ() {
    return this.appService.getFAQ();
  }

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get('register')
  @Render('users/signUp')
  registerPage() {
    return this.appService.getRegisterPage();
  }

  @UseGuards(SessionGuard)
  @UseFilters(new ForbiddenExceptionFilter())
  @Get('login')
  @Render('users/logIn')
  loginPage() {
    return this.appService.getLoginPage();
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(new UnauthorizedExceptionFilter())
  @Get('profile')
  @Render('logged/profile')
  profilePage(@Request() req) {
    return this.usersService.findByEmail(req.user.email);
  }
}
