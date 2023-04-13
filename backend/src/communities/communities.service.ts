import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { ArrayContains, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityMember } from '../community-members/entities/community-member.entity';
import { MemberRole } from '../community-members/enums/member-role.enum';
import { SearchCommunitiesDto } from './dto/search-communities.dto';

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
      const createdCommunity = await transaction.save(community);

      const communityMember = transaction.create(CommunityMember, {
        communityId: createdCommunity.id,
        memberId: userId,
        memberRole: MemberRole.ADMIN,
      });
      await transaction.save(communityMember);

      return createdCommunity;
    });
  }

  async findAll() {
    return this.communitiesService.find({ relations: { members: true } });
  }

  async findOne(id: number) {
    return this.communitiesService.findOne({
      where: { id },
    });
  }

  async search(searchQuery: SearchCommunitiesDto) {
    return this.communitiesService.find({
      where: {
        name: ILike(`%${searchQuery.searchLine}%`),
        textContent: ILike(`%${searchQuery}%`),
        communityType: ArrayContains(searchQuery.communityType),
      },
      take: 6 * Number(searchQuery.resultMultiplyer),
      order: {
        createdAt: searchQuery.sortByCreated,
      },
    });
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
    return this.communitiesService.manager.transaction(async (transaction) => {
      await transaction.delete(CommunityMember, { communityId: id });

      await transaction.delete(Community, { id });
    });
  }
}
