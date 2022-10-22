import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { validationParser } from './validation.parser';

@Catch(BadRequestException)
export class HttpValidationFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { body } = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errs = validationParser(exception.getResponse());
    response.status(status);
    response.render('users/signUp', {
      errs,
      body,
    });
  }
}
