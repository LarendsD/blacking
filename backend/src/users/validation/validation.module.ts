import { Module } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { SessionService } from '../../session/session.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, SessionService, JwtService],
})
export class ValidationModule {}
