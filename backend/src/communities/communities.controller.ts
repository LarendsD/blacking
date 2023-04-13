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
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { User } from '../users/user.decorator';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Action } from '../casl/action.enum';
import { SearchCommunitiesDto } from './dto/search-communities.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @User('id') userId: number,
    @Body() createCommunityDto: CreateCommunityDto,
  ) {
    return this.communitiesService.create(userId, createCommunityDto);
  }

  @Get()
  findAll() {
    return this.communitiesService.findAll();
  }

  @Get('search')
  async searchCommunities(@Query() searchQuery: SearchCommunitiesDto) {
    return this.communitiesService.search(searchQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Update)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
  ) {
    return this.communitiesService.update(+id, updateCommunityDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Delete)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communitiesService.remove(+id);
  }
}
