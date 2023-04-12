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
import { CommunityMembersService } from './community-members.service';
import { CreateCommunityMemberDto } from './dto/create-community-member.dto';
import { UpdateCommunityMemberDto } from './dto/update-community-member.dto';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { User } from '../users/user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Action } from '../casl/action.enum';

@Controller('community-members')
export class CommunityMembersController {
  constructor(
    private readonly communityMembersService: CommunityMembersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':communityId')
  async create(
    @User('id') userId: number,
    @Param('communityId') communityId: number,
    @Body() createCommunityMemberDto: CreateCommunityMemberDto,
  ) {
    return this.communityMembersService.create(
      userId,
      communityId,
      createCommunityMemberDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Read)
  @Get('community/:communityId')
  async findAllInCommunity(@Param('communityId') communityId: number) {
    return this.communityMembersService.findAllInCommunity(communityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Read)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.communityMembersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(Action.Update)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCommunityMemberDto: UpdateCommunityMemberDto,
  ) {
    return this.communityMembersService.update(id, updateCommunityMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@User('id') userId: number, @Param('id') id: number) {
    return this.communityMembersService.remove(id, userId);
  }
}
