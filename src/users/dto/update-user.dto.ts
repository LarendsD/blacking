import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 30)
  firstName?: string;

  @IsString()
  @Length(2, 30)
  lastName?: string;

  @IsEmail()
  @IsString()
  @Length(5, 50)
  email?: string;
}
