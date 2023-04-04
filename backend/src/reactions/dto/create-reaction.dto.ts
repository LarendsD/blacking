import { IsEnum } from 'class-validator';
import { ReactionType } from '../entities/enums/reaction-type.enum';

export class CreateReactionDto {
  @IsEnum(ReactionType)
  reactionType: ReactionType;
}
