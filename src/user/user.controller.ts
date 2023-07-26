import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor() {}

  @Get('list')
  async getUserList() {
    return 'List';
  }

  @Post()
  async createUserAccount() {
    return 'New User';
  }
  @Delete('userId')
  async deleteUserAccount() {}
  @Patch(':userId')
  async updateUserProfile() {}
}
