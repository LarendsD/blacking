import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ContentDto } from '../../common/dto/content.dto';
import { CommunityType } from '../entities/enums/community-type.enum';

export class CreateCommunityDto extends ContentDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsArray()
  @IsEnum(CommunityType, { each: true })
  communityType: CommunityType[];

  @IsOptional()
  @IsString()
  avatar: string;
}
