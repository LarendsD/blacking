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
import { UsersService } from './users.service';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../session/guards/jwt-auth.guard';
import { RecoverUserDto } from './dto/recover-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Post('confirm')
  async confirm(
    @Body()
    confirmUserDto: ConfirmUserDto,
  ) {
    return this.usersService.confirm(confirmUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post('recover')
  async recover(@Body() recoverUserDto: RecoverUserDto) {
    return this.usersService.recover(recoverUserDto);
  }

  @Get('recover/:hash')
  async checkHash(@Param('hash') hash: string) {
    return this.usersService.checkHash(hash);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
