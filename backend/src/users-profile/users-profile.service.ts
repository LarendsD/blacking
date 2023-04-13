import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, ILike, Raw, Repository } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';
import { SearchUserProfileDto } from './dto/search-user-profile.dto';

@Injectable()
export class UsersProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const userProfileEntity = new UserProfile();
    const userProfile = this.usersProfileRepository.merge(
      userProfileEntity,
      createUserProfileDto,
    );

    return this.usersProfileRepository.save(userProfile);
  }

  async findAll() {
    return this.usersProfileRepository.find();
  }

  async findById(id: number) {
    return this.usersProfileRepository.findOneBy({ id });
  }

  async search(searchQuery: SearchUserProfileDto): Promise<UserProfile[]> {
    return this.usersProfileRepository.find({
      where: {
        firstName: ILike(`${searchQuery.searchLine}%`),
        lastName: ILike(`${searchQuery.searchLine}%`),
        middleName: ILike(`${searchQuery.searchLine}%`),
        gender: searchQuery.gender,
        birthday: Raw(
          (alias) =>
            `EXTRACT(YEAR FROM INTERVAL AGE(NOW(), ${alias})) BETWEEN :startAge AND :endAge`,
          {
            startAge: searchQuery.startAge ?? null,
            endAge: searchQuery.endAge ?? null,
          },
        ),
        countryCity: searchQuery.countryCity,
        education: searchQuery.education,
        educationType: searchQuery.educationType,
        itDirection: searchQuery.itDirection,
        itLangs: ArrayContains(searchQuery.itLangs),
        itFrameworks: ArrayContains(searchQuery.itFrameworks),
        itDatabases: ArrayContains(searchQuery.itDatabases),
        itOtherInstruments: ArrayContains(searchQuery.itOtherInstruments),
      },
      take: 6 * Number(searchQuery.resultMultiplyer),
      order: {
        birthday: searchQuery.ageSort,
      },
    });
  }

  async update(id: number, updateUserProfileDto: UpdateUserProfileDto) {
    const currentUserProfile = await this.usersProfileRepository.findOneBy({
      id,
    });
    const updatedUserProfile = this.usersProfileRepository.merge(
      currentUserProfile,
      updateUserProfileDto,
    );
    return this.usersProfileRepository.save(updatedUserProfile);
  }

  async remove(id: number) {
    await this.usersProfileRepository.delete({ id });
  }
}
