import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import { CheckEmail } from '../validation/compare-emails';
import { ComparePasswords } from '../validation/compare-passwords';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @Validate(CheckEmail)
  @Length(5, 50)
  email: string;

  @Matches(/[0-9]/)
  @Matches(/[a-z]/)
  @Matches(/[A-Z]/)
  password: string;

  @Validate(ComparePasswords)
  confirmPassword: string;
}
