import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ColleagueshipStatus } from '../entities/enums/colleagueship-status.enum';

export class CreateColleagueshipDto {
  @IsNumber()
  colleagueId: number;

  @IsOptional()
  @IsEnum(ColleagueshipStatus)
  status: ColleagueshipStatus;
}
