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
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @User('id') userId: number,
  ) {
    return this.messagesService.create(userId, createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllOfLoggedUser(@User('id') userId: number) {
    return this.messagesService.findAllOfLoggedUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Body() updateMessageDto: UpdateMessageDto,
    @Param('id') id: number,
    @User('id') userId: number,
  ) {
    return this.messagesService.update(id, userId, updateMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@User('id') userId: number, @Param('id') id: number) {
    return this.messagesService.delete(id, userId);
  }
}
