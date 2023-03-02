import { IsString, Validate, IsEmail } from 'class-validator';
import { CheckEmail } from '../validation/compare-emails';

export class RecoverUserDto {
  @IsString()
  @IsEmail()
  @Validate(CheckEmail, {
    message: 'Email не найден!',
  })
  email: string;

  @IsString()
  frontendUrl: string;
}
