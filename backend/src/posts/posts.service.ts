import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { SearchDto } from '../common/dto/search.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const postEntity = new Post();
    postEntity.authorId = userId;

    const post = this.postsRepository.merge(postEntity, createPostDto);

    return this.postsRepository.save(post);
  }

  async findAll() {
    return this.postsRepository.find({
      relations: { author: true },
      order: {
        createdAt: {
          direction: 'desc',
        },
      },
    });
  }

  async findOne(id: number) {
    return this.postsRepository.findOne({
      where: { id },
      relations: { author: true },
    });
  }

  async findByAuthorId(authorId: number, searchQuery: SearchDto) {
    return this.postsRepository.find({
      where: {
        textContent: ILike(`%${searchQuery.searchLine}%`),
        communityId: IsNull(),
        authorId,
      },
      take: 6 * Number(searchQuery.resultMultiplyer),
    });
  }

  async findByCommunityId(communityId: number, searchQuery: SearchDto) {
    return this.postsRepository.find({
      where: {
        textContent: ILike(`%${searchQuery.searchLine}%`),
        communityId,
      },
      take: 6 * Number(searchQuery.resultMultiplyer),
    });
  }

  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update({ authorId: userId, id }, updatePostDto);

    return this.postsRepository.findOne({ where: { id } });
  }

  async remove(id: number, userId: number) {
    return this.postsRepository.delete({ id, authorId: userId });
  }
}
