import { UserProfile } from '../../users-profile/entities/user-profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  AfterLoad,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { encrypt } from '../../common/secure/encrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 80 })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, name: 'recover_hash' })
  recoverHash?: string;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_profile_id',
  })
  userProfile?: UserProfile;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = encrypt(this.password);
  }

  private tempPassword: string;

  @AfterLoad()
  async loadTempPassword() {
    this.tempPassword = this.password;
  }

  @BeforeUpdate()
  async hashPasswordIfNew() {
    if (this.tempPassword !== this.password) {
      this.password = encrypt(this.password);
    }
  }
}
