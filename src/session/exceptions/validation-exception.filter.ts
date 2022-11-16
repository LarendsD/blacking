import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { userMessage } from '../../ru/messages';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body } = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status);
    response.render('users/logIn', {
      errs: userMessage.login,
      body,
    });
  }
}
