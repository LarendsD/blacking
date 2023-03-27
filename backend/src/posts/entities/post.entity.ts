import { Content } from '../../common/entities/content.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post extends Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
