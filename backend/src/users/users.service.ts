import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cipher, decipher } from '../common/secure/cipher';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/create-user.dto';
import { RecoverUserDto } from './dto/recover-user.dto';
import { UserProfile } from '../users-profile/entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async confirm({ password, email, frontendUrl }: ConfirmUserDto) {
    const hash = cipher(
      JSON.stringify({ password, email: email.toLowerCase() }),
    );

    const url = `${frontendUrl}/confirm/${hash}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`This is your confirming url: ${url}`);
    } else {
      await this.mailerService.sendMail({
        to: email,
        from: 'noreply@blacking.com',
        subject: 'Confirm your email!',
        template: 'confirm',
        context: {
          url,
        },
      });
    }

    return { email, hash };
  }

  async create({ hash }: CreateUserDto) {
    const user = new User();
    const { password, email } = JSON.parse(decipher(Buffer.from(hash, 'hex')));

    user.email = email;
    user.password = password;

    return this.usersRepository.manager.transaction(async (transaction) => {
      await transaction.save(user);

      const userProfile = new UserProfile();
      userProfile.user = user;
      return transaction.save(userProfile);
    });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { userId, ...data } = updateUserDto;
    const currentUser = await this.usersRepository.findOneBy({ id });
    const updatedUser = this.usersRepository.merge(currentUser, data);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async recover({ email, frontendUrl }: RecoverUserDto) {
    const recoverHash = cipher(email);
    const currentUser = await this.findByEmail(email);
    await this.usersRepository.update(currentUser.id, {
      recoverHash: recoverHash,
    });

    const url = `${frontendUrl}/recovery/${recoverHash}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log(`This is your recovering url: ${url}`);
    } else {
      setTimeout(async () => {
        await this.usersRepository.update(currentUser.id, {
          recoverHash: null,
        });
      }, 900000);

      this.mailerService.sendMail({
        to: email,
        from: 'noreply@runit.com',
        subject: 'Ссылка для изменения пароля на Blacking',
        template: 'recover',
        context: {
          url,
        },
      });
    }
    return { email, hash: recoverHash };
  }

  async checkHash(hash: string): Promise<{ id: number | null }> {
    const email = decipher(Buffer.from(hash, 'hex'));
    const currentUser = await this.findByEmail(email);

    if (currentUser && currentUser.recoverHash === hash) {
      await this.usersRepository.update(currentUser.id, { recoverHash: null });
      return { id: currentUser.id };
    }
    return { id: null };
  }

  async remove(id: number) {
    await this.usersRepository.delete({ id });
  }
}
