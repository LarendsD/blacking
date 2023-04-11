import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reaction } from './common/reaction.abstract-entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('posts_reactions')
export class PostReaction extends Reaction {
  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'post_id' })
  post?: Post;
}
