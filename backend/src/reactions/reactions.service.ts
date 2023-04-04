import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentReaction } from './entities/comment-reaction.entity';
import { Repository } from 'typeorm';
import { PostReaction } from './entities/post-reaction.entity';
import { repositoryMap } from './mappings/repository.map';
import { SubjectType } from './dto/enums/subject-type.enum';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(CommentReaction)
    private readonly commentReactionRepostory: Repository<CommentReaction>,
    @InjectRepository(PostReaction)
    private readonly postReactionRepository: Repository<PostReaction>,
  ) {}

  async create(
    id: number,
    userId: number,
    subject: SubjectType,
    createReactionDto: CreateReactionDto,
  ) {
    const { name, ReactionEntity, idColumn } = repositoryMap[subject];

    const reactionEntity = new ReactionEntity();
    reactionEntity[idColumn] = id;
    reactionEntity.userId = userId;

    const reaction = this[name].merge(reactionEntity, createReactionDto);

    return this[name].save(reaction);
  }

  async findAll(id: number, subject: SubjectType) {
    const { name, idColumn, entityColumn } = repositoryMap[subject];

    return this[name].find({
      where: { [idColumn]: id },
      relations: { [entityColumn]: true },
    });
  }

  async findOne(id: number, subject: SubjectType) {
    const { name, entityColumn } = repositoryMap[subject];

    return this[name].findOne({
      where: { id },
      relations: {
        [entityColumn]: true,
      },
    });
  }

  async update(
    id: number,
    subject: SubjectType,
    updateReactionDto: UpdateReactionDto,
  ) {
    const { name } = repositoryMap[subject];

    await this[name].update({ id }, updateReactionDto);

    return this[name].findOne({ where: { id } });
  }

  async remove(id: number, subject: SubjectType) {
    const { name } = repositoryMap[subject];

    return this[name].delete({ id });
  }
}
