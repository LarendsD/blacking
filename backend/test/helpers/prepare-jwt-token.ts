import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/users/entities/user.entity';

export const prepareJwtToken = (jwtService: JwtService, user: User): string => {
  const { id, email, profileId } = user;

  return jwtService.sign({ id, email, profileId });
};
