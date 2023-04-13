import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtPrivateProfileAuthGuard } from '../session/guards/jwt-private-profile-auth.guard';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersProfileService } from './users-profile.service';
import { SearchUserProfileDto } from './dto/search-user-profile.dto';

@Controller('users-profile')
export class UsersProfileController {
  constructor(private usersProfileService: UsersProfileService) {}

  @Post()
  async create(
    @Body()
    createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.usersProfileService.create(createUserProfileDto);
  }

  @Get('search')
  async searchProfiles(@Query() searchQuery: SearchUserProfileDto) {
    return this.usersProfileService.search(searchQuery);
  }

  @Get()
  findAll() {
    return this.usersProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersProfileService.findById(id);
  }

  @UseGuards(JwtPrivateProfileAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserProfileDto) {
    return this.usersProfileService.update(id, updateUserDto);
  }

  @UseGuards(JwtPrivateProfileAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersProfileService.remove(+id);
  }
}
