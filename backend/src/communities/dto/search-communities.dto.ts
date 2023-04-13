import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { CommunityType } from '../entities/enums/community-type.enum';
import { SearchDto } from '../../common/dto/search.dto';
import { SortOrder } from '../../common/enums/sort-order.enum';

export class SearchCommunitiesDto extends SearchDto {
  @IsOptional()
  @IsEnum(SortOrder)
  sortByCreated: SortOrder;

  @IsOptional()
  @IsArray()
  @IsEnum(CommunityType, { each: true })
  communityType: CommunityType[];
}
