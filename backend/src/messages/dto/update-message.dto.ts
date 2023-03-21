import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  textContent: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageContent: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videoContent: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  musicContent: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherContent: string[];
}
