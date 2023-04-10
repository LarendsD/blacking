import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';

export const prepareUsers = async (
  repo: Repository<User>,
  data: Array<Record<string, unknown>>,
): Promise<User[]> => {
  const users = repo.create(data);
  return repo.save(users);
};
