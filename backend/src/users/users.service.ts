import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cipher, decipher } from '../common/secure/cipher';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async confirm({ password, email, frontendUrl }: ConfirmUserDto) {
    const hash = cipher(JSON.stringify({ password, email }));

    const url = `${frontendUrl}/confirm/${hash}`;

    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@blacking.com',
      subject: 'Confirm your email!',
      template: 'confirm',
      context: {
        url,
      },
    });

    return { email, hash };
  }

  async create({ hash }: CreateUserDto) {
    const user = new User();
    const { password, email } = JSON.parse(decipher(Buffer.from(hash, 'hex')));

    user.email = email;
    user.password = password;
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: number) {
    const { email, created_at, updated_at, password } =
      await this.usersRepository.findOneBy({ id });

    return { email, created_at, updated_at, password };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { userId, ...data } = updateUserDto;
    const currentUser = await this.usersRepository.findOneBy({ id });
    const updatedUser = this.usersRepository.merge(currentUser, data);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async remove(id: number) {
    await this.usersRepository.delete({ id });
  }
}
