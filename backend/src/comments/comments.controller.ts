import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { User } from '../users/user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @User('id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, userId, createCommentDto);
  }

  @Get('post/:postId')
  findAllCommentsOfPost(@Param('postId') postId: number) {
    return this.commentsService.findAllCommentsOfPost(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @User('id') userId: number,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, userId, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@User('id') userId: number, @Param('id') id: number) {
    return this.commentsService.remove(id, userId);
  }
}
