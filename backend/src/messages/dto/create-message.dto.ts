import { ContentDto } from '../../common/dto/content.dto';
import { IsNumber } from 'class-validator';

export class CreateMessageDto extends ContentDto {
  @IsNumber()
  addresseeId: number;
}
