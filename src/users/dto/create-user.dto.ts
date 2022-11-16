import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import { userMessage } from '../../ru/messages';
import { CheckEmail } from '../validation/compare-emails';
import { ComparePasswords } from '../validation/compare-passwords';

export class CreateUserDto {
  @IsString()
  @Length(2, 30, {
    message: userMessage.firstNameLength,
  })
  firstName: string;

  @IsString()
  @Length(2, 30, {
    message: userMessage.lastNameLength,
  })
  lastName: string;

  @IsEmail(
    {},
    {
      message: userMessage.emailInvalid,
    },
  )
  @IsString()
  @Validate(CheckEmail, {
    message: userMessage.emailExists,
  })
  @Length(5, 50, {
    message: userMessage.emailLength,
  })
  email: string;

  @Matches(/[0-9]/, {
    message: userMessage.passwordInvalid,
  })
  @Matches(/[a-z]/, {
    message: userMessage.passwordInvalid,
  })
  @Matches(/[A-Z]/, {
    message: userMessage.passwordInvalid,
  })
  password: string;

  @Validate(ComparePasswords, {
    message: userMessage.comparePasswords,
  })
  confirmPassword: string;
}
