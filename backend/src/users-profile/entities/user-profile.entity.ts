import { User } from '../../users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EducationType } from './enums/education-type.enum';
import { Education } from './enums/education.enum';
import { Gender } from './enums/gender.enum';
import { ITDatabase } from './enums/it-db.enum';
import { ITDirection } from './enums/it-direction.enum';
import { ITFramework } from './enums/it-framework.enum';
import { ITLang } from './enums/it-lang.enum';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'first_name' })
  firstName?: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'last_name' })
  lastName?: string;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'middle_name' })
  middleName?: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'country_city' })
  countryCity?: string;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ type: 'enum', enum: Education, nullable: true })
  education?: Education;

  @Column({
    type: 'enum',
    enum: EducationType,
    nullable: true,
    name: 'education_type',
  })
  educationType?: EducationType;

  @Column({
    type: 'enum',
    enum: ITDirection,
    nullable: true,
    name: 'it_direction',
  })
  itDirection?: ITDirection;

  @Column({
    type: 'enum',
    enum: ITLang,
    array: true,
    nullable: true,
    name: 'it_langs',
  })
  itLangs?: ITLang[];

  @Column({
    type: 'enum',
    enum: ITFramework,
    array: true,
    nullable: true,
    name: 'it_frameworks',
  })
  itFrameworks?: ITFramework[];

  @Column({
    type: 'enum',
    enum: ITDatabase,
    array: true,
    nullable: true,
    name: 'it_databases',
  })
  itDatabases?: ITDatabase[];

  @Column('varchar', {
    array: true,
    nullable: true,
    name: 'it_other_instruments',
  })
  itOtherInstruments?: string[];

  @OneToOne(() => User, (user) => user.userProfile)
  user?: User;
}
