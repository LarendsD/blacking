import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { CheckEmail } from './validation/compare-emails';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, CheckEmail],
  exports: [TypeOrmModule.forFeature([Users]), UsersService],
})
export class UsersModule {}
