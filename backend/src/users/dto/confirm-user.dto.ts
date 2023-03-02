import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import { CheckEmail } from '../validation/compare-emails';
import { ComparePasswords } from '../validation/compare-passwords';

export class ConfirmUserDto {
  @IsString()
  frontendUrl: string;

  @IsEmail()
  @IsString()
  @Validate(CheckEmail, {
    message: 'Email validation err',
  })
  @Length(5, 50)
  email: string;

  @Matches(/[0-9]/)
  @Matches(/[a-z]/)
  @Matches(/[A-Z]/)
  password: string;

  @Validate(ComparePasswords, {
    message: 'Passwords match validation err',
  })
  confirmPassword: string;
}
