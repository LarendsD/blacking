import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/user.decorator';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Action } from '../casl/action.enum';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Create)
  @Post()
  create(@User('id') userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Read)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Read)
  @Get('community/:communityId')
  findByCommunityId(@Param('communityId') communityId: number) {
    return this.postsService.findByCommunityId(communityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Update)
  @Patch(':id')
  update(
    @User('id') userId: number,
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, userId, updatePostDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Delete)
  @Delete(':id')
  remove(@User('id') userId: number, @Param('id') id: number) {
    return this.postsService.remove(id, userId);
  }
}
