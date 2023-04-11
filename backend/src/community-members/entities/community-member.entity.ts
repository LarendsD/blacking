import { Community } from '../../communities/entities/community.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from '../enums/member-role.enum';

@Entity('community_members')
export class CommunityMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'member_id' })
  member: User;

  @Column({ name: 'community_id' })
  communityId: number;

  @ManyToOne(() => Community, (community) => community.id)
  @JoinColumn({ name: 'community_id' })
  community: Community;

  @Column({
    type: 'enum',
    name: 'member_role',
    enum: MemberRole,
    default: MemberRole.VIEWER,
  })
  memberRole: MemberRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: string;
}
