import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Content } from '../../common/entities/content.entity';

@Entity('messages')
export class Message extends Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column({ name: 'addressee_id' })
  addresseeId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'addresee_id' })
  addressee: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
