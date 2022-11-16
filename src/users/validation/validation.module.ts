import { Module } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UsersController } from '../users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/user.entity';
import { SessionService } from 'src/session/session.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, SessionService, JwtService],
})
export class ValidationModule {}
