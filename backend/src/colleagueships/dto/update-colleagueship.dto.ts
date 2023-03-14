import { IsEnum } from 'class-validator';
import { ColleagueshipStatus } from '../entities/enums/colleagueship-status.enum';

export class UpdateColleagueshipDto {
  @IsEnum(ColleagueshipStatus)
  status: ColleagueshipStatus;
}
