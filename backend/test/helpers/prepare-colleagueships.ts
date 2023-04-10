import { Colleagueship } from '../../src/colleagueships/entities/colleagueship.entity';
import { ColleagueshipStatus } from '../../src/colleagueships/entities/enums/colleagueship-status.enum';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareColleagueship = async (
  repo: Repository<Colleagueship>,
  userData: User[],
): Promise<Colleagueship[]> => {
  return repo.save([
    {
      colleagueId: userData[1].id,
      userId: userData[0].id,
      status: ColleagueshipStatus.PENDING,
    },
    {
      colleagueId: userData[0].id,
      userId: userData[1].id,
      status: ColleagueshipStatus.PENDING,
    },
    {
      colleagueId: userData[1].id,
      userId: userData[2].id,
      status: ColleagueshipStatus.APPROVED,
    },
    {
      colleagueId: userData[2].id,
      userId: userData[1].id,
      status: ColleagueshipStatus.APPROVED,
    },
  ]);
};
