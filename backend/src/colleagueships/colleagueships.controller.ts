import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { User } from '../users/user.decorator';
import { ColleagueshipsService } from './colleagueships.service';
import { CreateColleagueshipDto } from './dto/create-colleagueship.dto';
import { UpdateColleagueshipDto } from './dto/update-colleagueship.dto';

@Controller('colleagueship')
export class ColleagueshipsController {
  constructor(private colleagueshipsService: ColleagueshipsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllColleaguesOfLoggedUser(@User('id') userId: number) {
    return this.colleagueshipsService.findAllColleaguesOfLoggedUser(userId);
  }

  @Get(':userId')
  async findAllColleaguesOfUser(@Param('userId') userId: number) {
    return this.colleagueshipsService.findColleaguesOfUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @User('id') userId: number,
    @Body() createColleagueshipDto: CreateColleagueshipDto,
  ) {
    return this.colleagueshipsService.create(userId, createColleagueshipDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':colleagueId')
  async update(
    @User('id') userId: number,
    @Param('colleagueId') colleagueId: number,
    @Body() updateColleagueshipDto: UpdateColleagueshipDto,
  ) {
    return this.colleagueshipsService.update(
      userId,
      colleagueId,
      updateColleagueshipDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':colleagueId')
  async delete(
    @User('id') userId: number,
    @Param('colleagueId') colleagueId: number,
  ) {
    return this.colleagueshipsService.delete(userId, colleagueId);
  }
}
