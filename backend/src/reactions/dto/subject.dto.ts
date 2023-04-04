import { IsEnum } from 'class-validator';
import { SubjectType } from './enums/subject-type.enum';

export class SubjectDto {
  @IsEnum(SubjectType)
  subject: SubjectType;
}
