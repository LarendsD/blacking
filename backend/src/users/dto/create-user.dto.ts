import { IsString, Validate } from 'class-validator';
import { CheckHash } from '../validation/check-hash';

export class CreateUserDto {
  @IsString()
  @Validate(CheckHash, {
    message: 'Hash is invalid!',
  })
  hash: string;
}
