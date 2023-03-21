import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
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

  @Column('text', { name: 'text_content' })
  textContent: string;

  @Column('text', { name: 'image_content', array: true, nullable: true })
  imageContent: string[];

  @Column('text', { name: 'video_content', array: true, nullable: true })
  videoContent: string[];

  @Column('text', { name: 'music_content', array: true, nullable: true })
  musicContent: string[];

  @Column('text', { name: 'other_content', array: true, nullable: true })
  otherContent: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
