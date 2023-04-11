import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommunityType } from './enums/community-type.enum';
import { Content } from '../../common/entities/content.entity';
import { CommunityMember } from '../../community-members/entities/community-member.entity';

@Entity('communities')
export class Community extends Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column('enum', {
    enum: CommunityType,
    array: true,
    nullable: true,
    name: 'community_type',
  })
  communityType: CommunityType[];

  @OneToMany(() => CommunityMember, (communityMember) => communityMember.id)
  communityMembers: CommunityMember[];

  @Column('text', { nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
