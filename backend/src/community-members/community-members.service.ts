import { Injectable } from '@nestjs/common';
import { CreateCommunityMemberDto } from './dto/create-community-member.dto';
import { UpdateCommunityMemberDto } from './dto/update-community-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityMember } from './entities/community-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunityMembersService {
  constructor(
    @InjectRepository(CommunityMember)
    private readonly communityMembersRepository: Repository<CommunityMember>,
  ) {}

  async create(
    userId: number,
    communityId: number,
    createCommunityMemberDto: CreateCommunityMemberDto,
  ) {
    const communityMember = this.communityMembersRepository.merge(
      new CommunityMember(),
      { memberId: userId, communityId, ...createCommunityMemberDto },
    );

    return this.communityMembersRepository.save(communityMember);
  }

  async findAllInCommunity(communityId: number) {
    return this.communityMembersRepository.find({
      where: {
        communityId,
      },
      relations: {
        member: true,
      },
    });
  }

  async findOne(id: number) {
    return this.communityMembersRepository.findOne({ where: { id } });
  }

  async findOneByCommunityId(
    params: { communityId?: number; id?: number },
    userId: number,
  ) {
    let community: CommunityMember;
    if (params.id && !params.communityId) {
      community = await this.findOne(params.id);
    }

    return this.communityMembersRepository.findOne({
      where: {
        memberId: userId,
        communityId: params.communityId ?? community.communityId,
      },
    });
  }

  async update(id: number, updateCommunityMemberDto: UpdateCommunityMemberDto) {
    const currentMember = await this.communityMembersRepository.findOne({
      where: { id },
    });

    const updatedMember = this.communityMembersRepository.merge(
      currentMember,
      updateCommunityMemberDto,
    );

    return this.communityMembersRepository.save(updatedMember);
  }

  async remove(id: number, userId: number) {
    return this.communityMembersRepository.delete({ id, memberId: userId });
  }
}
