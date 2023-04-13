import { IsNumberString, IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  searchLine: string;

  @IsNumberString()
  resultMultiplyer: string;
}
