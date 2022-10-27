import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [ProfileController],
  providers: [UsersService],
})
export class ProfileModule {}
