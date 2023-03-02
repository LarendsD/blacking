import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'email', async: true })
@Injectable()
export class CheckEmail implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(text: string, validationArguments: ValidationArguments) {
    const email = validationArguments.value;
    const userId = validationArguments.object['userId'];
    const exists = await this.usersService.findByEmail(email);
    if (userId && userId == exists?.id) {
      return true;
    }
    return !exists;
  }
}
