import { IsEmail, IsString, Length, Matches, Validate } from 'class-validator';
import { registerMessage } from 'src/ru/messages';
import { CheckEmail } from '../validation/compare-emails';
import { ComparePasswords } from '../validation/compare-passwords';

export class CreateUserDto {
  @IsString()
  @Length(2, 30, {
    message: registerMessage.firstNameLength,
  })
  firstName: string;

  @IsString()
  @Length(2, 30, {
    message: registerMessage.lastNameLength,
  })
  lastName: string;

  @IsEmail(
    {},
    {
      message: registerMessage.emailInvalid,
    },
  )
  @IsString()
  @Validate(CheckEmail, {
    message: registerMessage.emailExists,
  })
  @Length(5, 50, {
    message: registerMessage.emailLength,
  })
  email: string;

  @Matches(/[0-9]/, {
    message: registerMessage.passwordInvalid,
  })
  @Matches(/[a-z]/, {
    message: registerMessage.passwordInvalid,
  })
  @Matches(/[A-Z]/, {
    message: registerMessage.passwordInvalid,
  })
  password: string;

  @Validate(ComparePasswords, {
    message: registerMessage.comparePasswords,
  })
  confirmPassword: string;
}
