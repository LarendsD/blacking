import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserProfile } from './entities/user-profile.entity';

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
