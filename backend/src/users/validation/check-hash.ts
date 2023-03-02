import { Injectable } from '@nestjs/common';
import { decipher } from '../../common/secure/cipher';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';
import { dataHash } from './interfaces/data-hash.interface';

@ValidatorConstraint({ name: 'hash', async: true })
@Injectable()
export class CheckHash implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(text: string, validationArguments: ValidationArguments) {
    const hash = validationArguments.value;
    let data: dataHash;
    try {
      data = JSON.parse(decipher(Buffer.from(hash, 'hex')));
    } catch {
      return false;
    }
    const exists = await this.usersService.findByEmail(data.email);
    return !exists && !!data.email;
  }
}
