import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CheckEmail } from './validation/compare-emails';
import { CheckHash } from './validation/check-hash';
import { CheckPassword } from './validation/check-password';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CheckEmail, CheckHash, CheckPassword],
  exports: [TypeOrmModule.forFeature([User]), UsersService],
})
export class UsersModule {}
