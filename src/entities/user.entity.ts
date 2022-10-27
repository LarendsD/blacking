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

  @Column({ nullable: true })
  liveInCity: string;

  @Column({ nullable: true })
  birtdayDate: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  directions: string;

  @Column({ nullable: true })
  frameworks: string;

  @Column({ nullable: true })
  programmingLanguages: string;

  @Column({ nullable: true })
  expirience: string;

  @Column({ nullable: true })
  databases: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
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
