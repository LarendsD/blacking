export {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationType } from '../entities/enums/education-type.enum';
import { Education } from '../entities/enums/education.enum';
import { Gender } from '../entities/enums/gender.enum';
import { ITDatabase } from '../entities/enums/it-db.enum';
import { ITDirection } from '../entities/enums/it-direction.enum';
import { ITFramework } from '../entities/enums/it-framework.enum';
import { ITLang } from '../entities/enums/it-lang.enum';
import { SortOrder } from '../../common/enums/sort-order.enum';
import { SearchDto } from '../../common/dto/search.dto';

export class SearchUserProfileDto extends SearchDto {
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsNumber()
  startAge: number;

  @IsOptional()
  @IsNumber()
  endAge: number;

  @IsOptional()
  @IsString()
  countryCity: string;

  @IsOptional()
  @IsEnum(Education)
  education: Education;

  @IsOptional()
  @IsEnum(EducationType)
  educationType: EducationType;

  @IsOptional()
  @IsEnum(ITDirection)
  itDirection: ITDirection;

  @IsOptional()
  @IsArray()
  @IsEnum(ITLang, { each: true })
  itLangs: ITLang[];

  @IsOptional()
  @IsArray()
  @IsEnum(ITFramework, { each: true })
  itFrameworks: ITFramework[];

  @IsOptional()
  @IsArray()
  @IsEnum(ITDatabase, { each: true })
  itDatabases: ITDatabase[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  itOtherInstruments: string[];

  @IsOptional()
  @IsEnum(SortOrder)
  ageSort: SortOrder;
}
