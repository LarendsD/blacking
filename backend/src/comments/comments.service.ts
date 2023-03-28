import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(
    postId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const commentEntity = new Comment();
    commentEntity.authorId = userId;
    commentEntity.postId = postId;

    const comment = this.commentRepository.merge(
      commentEntity,
      createCommentDto,
    );

    return this.commentRepository.save(comment);
  }

  async findAllCommentsOfPost(postId: number) {
    return this.commentRepository.find({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.commentRepository.findOne({
      where: { id },
      relations: { author: true, post: true },
    });
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(
      { id, authorId: userId },
      updateCommentDto,
    );

    return this.commentRepository.findOne({ where: { id } });
  }

  async remove(id: number, userId: number) {
    return this.commentRepository.delete({ id, authorId: userId });
  }
}
