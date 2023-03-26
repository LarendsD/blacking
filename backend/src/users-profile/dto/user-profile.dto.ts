import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { EducationType } from '../entities/enums/education-type.enum';
import { Education } from '../entities/enums/education.enum';
import { Gender } from '../entities/enums/gender.enum';
import { ITDatabase } from '../entities/enums/it-db.enum';
import { ITDirection } from '../entities/enums/it-direction.enum';
import { ITFramework } from '../entities/enums/it-framework.enum';
import { ITLang } from '../entities/enums/it-lang.enum';

export class UserProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  @Matches(/[a-zA-Zа-яА-Я]/)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  @Matches(/[a-zA-Zа-яА-Я]/)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(2, 30)
  @Matches(/[a-zA-Zа-яА-Я]/)
  middleName: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  countryCity: string;

  @IsOptional()
  @IsString()
  about: string;

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
}
