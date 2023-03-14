import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ColleagueshipStatus } from './enums/colleagueship-status.enum';

@Entity('colleagueships')
export class Colleagueship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'colleague_id' })
  colleagueId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.colleagues)
  @JoinColumn({ name: 'colleague_id' })
  colleague: User;

  @Column({
    type: 'enum',
    enum: ColleagueshipStatus,
    name: 'status',
    default: ColleagueshipStatus.PENDING,
  })
  status: ColleagueshipStatus;
}
