import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  UserCreateDto,
  UserloginDto,
  UserloginSocialDto,
} from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { PublicUserData } from './interface/user.interface';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/pagination/response';

@ApiTags('User')
@ApiExtraModels(PublicUserData, PaginatedDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @ApiPaginatedResponse('entities', PublicUserData)
  @Get('list')
  async getUserList(@Query() query: PublicUserInfoDto) {
    return this.userService.getAllUsers(query);
  }

  @Post('account/create')
  async createUserAccount(@Req() req: any, @Body() body: UserCreateDto) {
    return this.userService.createUser(body);
  }
  @Post('account/:userId/animal')
  async addAnimalToUser() {
    return 'New Animal';
  }
  @Post('login')
  async loginUser(@Body() body: UserloginDto) {
    return this.userService.login(body);
  }

  @Post('social/login')
  async loginSocialUser(@Body() body: UserloginSocialDto) {
    return this.userService.loginSocial(body);
  }
  @Delete(':userId')
  async deleteUserAccount() {}
  @Patch(':userId')
  async updateUserProfile() {}
  @Get(':userId')
  async getUserProfile(@Param('userId') id: string) {
    // return this.userService.getOneUserAccount(id);
    return id;
  }
}
