import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
  IsNotEmpty,
} from 'class-validator';
import { CheckPassword } from '../validation/check-password';
import { CheckEmail } from '../validation/compare-emails';
import { ComparePasswords } from '../validation/compare-passwords';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  @Validate(CheckEmail)
  @Length(5, 50)
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(/[0-9]/)
  @Matches(/[a-z]/)
  @Matches(/[A-Z]/)
  @Validate(CheckPassword)
  currPassword: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Validate(ComparePasswords)
  confirmPassword?: string;
}
