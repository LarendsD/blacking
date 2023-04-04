import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { SubjectDto } from './dto/subject.dto';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { User } from '../users/user.decorator';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Query() { subject }: SubjectDto,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.reactionsService.create(id, userId, subject, createReactionDto);
  }

  @Get('subject/:id')
  findAll(@Param('id') id: number, @Query() { subject }: SubjectDto) {
    return this.reactionsService.findAll(id, subject);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Query() { subject }: SubjectDto) {
    return this.reactionsService.findOne(id, subject);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Query() { subject }: SubjectDto,
    @Body() updateReactionDto: UpdateReactionDto,
  ) {
    return this.reactionsService.update(id, subject, updateReactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Query() { subject }: SubjectDto) {
    return this.reactionsService.remove(id, subject);
  }
}
