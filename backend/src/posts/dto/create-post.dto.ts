import { IsNumber, IsOptional } from 'class-validator';
import { ContentDto } from '../../common/dto/content.dto';

export class CreatePostDto extends ContentDto {
  @IsOptional()
  @IsNumber()
  repostedId: number;
}
