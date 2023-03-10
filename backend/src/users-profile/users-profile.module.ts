import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { UsersProfileController } from './users-profile.controller';
import { UsersProfileService } from './users-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  controllers: [UsersProfileController],
  providers: [UsersProfileService],
  exports: [],
})
export class UsersProfileModule {}
