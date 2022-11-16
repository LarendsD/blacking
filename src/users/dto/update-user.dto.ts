import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { userMessage } from '../../ru/messages';
import { CheckEmail } from '../validation/compare-emails';

export class UpdateUserDto {
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

  @IsOptional()
  @IsString()
  @Length(2, 30, {
    message: userMessage.middleNameLength,
  })
  middleName: string;

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
}
