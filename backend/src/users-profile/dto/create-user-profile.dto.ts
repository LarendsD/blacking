import { IsNumber } from 'class-validator';
import { UserProfileDto } from './user-profile.dto';

export class CreateUserProfileDto extends UserProfileDto {
  @IsNumber()
  userId: number;
}
