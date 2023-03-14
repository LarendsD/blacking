import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColleagueshipDto } from './dto/create-colleagueship.dto';
import { UpdateColleagueshipDto } from './dto/update-colleagueship.dto';
import { Colleagueship } from './entities/colleagueship.entity';
import { ColleagueshipStatus } from './entities/enums/colleagueship-status.enum';

@Injectable()
export class ColleagueshipsService {
  constructor(
    @InjectRepository(Colleagueship)
    private colleagueshipsRepository: Repository<Colleagueship>,
  ) {}

  async findColleaguesOfUser(userId: number) {
    return this.colleagueshipsRepository.find({
      where: { userId, status: ColleagueshipStatus.APPROVED },
      relations: { colleague: true },
    });
  }

  async findAllColleaguesOfLoggedUser(userId: number) {
    return this.colleagueshipsRepository.find({
      where: { userId },
      relations: { colleague: true },
    });
  }

  async create(userId: number, createColleagueshipDto: CreateColleagueshipDto) {
    const colleagueshipOne = new Colleagueship();
    colleagueshipOne.userId = userId;
    colleagueshipOne.colleagueId = createColleagueshipDto.colleagueId;
    colleagueshipOne.status = createColleagueshipDto.status;

    const colleagueshipTwo = new Colleagueship();
    colleagueshipTwo.userId = createColleagueshipDto.colleagueId;
    colleagueshipTwo.colleagueId = userId;
    colleagueshipTwo.status = createColleagueshipDto.status;

    return this.colleagueshipsRepository.manager.transaction(
      async (transaction) => {
        await transaction.save(colleagueshipTwo);
        return transaction.save(colleagueshipOne);
      },
    );
  }

  async update(
    userId: number,
    colleagueId: number,
    updateColleagueshipDto: UpdateColleagueshipDto,
  ) {
    const currentColleagueshipOne = await this.colleagueshipsRepository.findOne(
      {
        where: {
          userId,
          colleagueId,
        },
      },
    );
    const updatedColleagueshipOne = this.colleagueshipsRepository.merge(
      currentColleagueshipOne,
      updateColleagueshipDto,
    );

    const currentColleagueshipTwo = await this.colleagueshipsRepository.findOne(
      {
        where: {
          userId: colleagueId,
          colleagueId: userId,
        },
      },
    );
    const updatedColleagueshipTwo = this.colleagueshipsRepository.merge(
      currentColleagueshipTwo,
      updateColleagueshipDto,
    );

    return this.colleagueshipsRepository.manager.transaction(
      async (transaction) => {
        await transaction.save(updatedColleagueshipTwo);
        return transaction.save(updatedColleagueshipOne);
      },
    );
  }

  async delete(userId: number, colleagueId: number) {
    return this.colleagueshipsRepository.manager.transaction(
      async (transaction) => {
        await transaction.delete(Colleagueship, { userId, colleagueId });
        return transaction.delete(Colleagueship, {
          userId: colleagueId,
          colleagueId: userId,
        });
      },
    );
  }
}
