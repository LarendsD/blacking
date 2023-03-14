import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColleagueshipsController } from './colleagueships.controller';
import { ColleagueshipsService } from './colleagueships.service';
import { Colleagueship } from './entities/colleagueship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colleagueship])],
  controllers: [ColleagueshipsController],
  providers: [ColleagueshipsService],
})
export class ColleagueshipModule {}
