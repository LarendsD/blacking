import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

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

  async update(id: number, userId: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update({ authorId: userId, id }, updatePostDto);

    return this.postsRepository.findOne({ where: { id } });
  }

  async remove(id: number, userId: number) {
    return this.postsRepository.delete({ id, authorId: userId });
  }
}
