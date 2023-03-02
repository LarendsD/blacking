import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  AfterLoad,
  BeforeUpdate,
} from 'typeorm';
import { encrypt } from '../../common/secure/encrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 80 })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  recover_hash?: string;

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
