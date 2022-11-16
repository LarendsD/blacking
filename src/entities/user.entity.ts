import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { encrypt } from '../users/secure/encrypt';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'Не указан' })
  liveInCity: string;

  @Column({ default: 'Не указан' })
  birthdayDate: string;

  @Column({ default: 'Не указано' })
  education: string;

  @Column({ default: 'Не указано' })
  directions: string;

  @Column({ default: 'Не указаны' })
  frameworks: string;

  @Column({ default: 'Не указаны' })
  programmingLanguages: string;

  @Column({ default: 'Не указан' })
  expirience: string;

  @Column({ default: 'Не указаны' })
  databases: string;

  @Column({ default: 'Не указан' })
  gender: string;

  @Column({ default: 'Пусто' })
  aboutMe: string;

  @Column({ default: '' })
  middleName: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = encrypt(this.password);
  }
}
