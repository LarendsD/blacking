import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communitiesService: Repository<Community>,
  ) {}

  async create(userId: number, createCommunityDto: CreateCommunityDto) {
    const communityEntity = new Community();

    const community = this.communitiesService.merge(
      communityEntity,
      createCommunityDto,
    );

    return this.communitiesService.manager.transaction(async (transaction) => {
      return transaction.save(community);
      // исплозьовать id для сохранения с базу участников в качестве админа
    });
  }

  async findAll() {
    return this.communitiesService.find();
  }

  async findOne(id: number) {
    return this.communitiesService.findOne({ where: { id } });
  }

  async update(id: number, updateCommunityDto: UpdateCommunityDto) {
    const currentCommunity = await this.communitiesService.findOne({
      where: { id },
    });

    const updatedCommunity = this.communitiesService.merge(
      currentCommunity,
      updateCommunityDto,
    );

    return this.communitiesService.save(updatedCommunity);
  }

  async remove(id: number) {
    return this.communitiesService.delete({ id });
  }
}
