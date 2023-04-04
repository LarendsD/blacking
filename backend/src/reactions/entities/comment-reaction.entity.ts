import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Reaction } from './common/reaction.abstract-entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('comments_reactions')
export class CommentReaction extends Reaction {
  @Column({ name: 'comment_id' })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.id)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
