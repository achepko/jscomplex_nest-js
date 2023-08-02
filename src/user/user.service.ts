import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {
  UserCreateDto,
  UserloginDto,
  UserloginSocialDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { PublicUserInfoDto } from '../common/query/user.query.dto';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { PublicUserData } from './interface/user.interface';
import { PaginatedDto } from '../common/pagination/response';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = '';
const GOOGLE_CLIENT_SECRET = '';

@Injectable()
export class UserService {
  // private users = [];
  private salt = 5;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async getAllUsers(
    query: PublicUserInfoDto,
  ): Promise<PaginatedDto<PublicUserData>> {
    query.sort = query.sort || 'id';
    query.order = query.order || 'ASC';
    const options = {
      page: query.page || 1,
      limit: query.limit || 2, //50
    };

    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .innerJoin('users.animal', 'ani')
      .select('id, age, email, "userName"');

    if (query.search) {
      queryBuilder.where('"userName" IN(:...search)', {
        search: query.search.split(','),
      });
    }
    if (query.class) {
      queryBuilder.andWhere(
        `LOWER(ani.class) LIKE '%${query.class.toLowerCase()}%'`,
      );
    }
    queryBuilder.orderBy(`"${query.sort}"`, query.order as 'ASC' | 'DESC');

    const [pagination, rawResults] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItem: pagination.meta.totalItems,
      entities: rawResults as [PublicUserData],
    };
  }

  async createUser(data: UserCreateDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (findUser) {
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await this.getHash(data.password);
    const newUser = this.userRepository.create(data);
    // await newUser.save();
    await this.userRepository.save(newUser);

    const token = await this.singIn(newUser);

    return { token };
  }

  async login(data: UserloginDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!findUser) {
      throw new HttpException(
        'Email or password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!(await this.compareHash(data.password, findUser.password))) {
      throw new HttpException(
        'Email or password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = await this.singIn(findUser);
    return { token };
  }

  async loginSocial(data: UserloginSocialDto) {
    try {
      const oAuthClient = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
      );

      const result = await oAuthClient.verifyIdToken({
        idToken: data.accessToken,
      });

      const tokenPayload = result.getPayload();
      const token = await this.singIn({ id: tokenPayload.sub });
      return { token };
    } catch (e) {
      throw new HttpException('Google auth failed', HttpStatus.UNAUTHORIZED);
    }
  }
  async getOneUserAccount(userId: string) {
    console.log(userId);
    // const user = this.users.find((item) => item.id === userId);
    return 'user';
  }

  async getHash(password: string) {
    return await bcrypt.hash(password, this.salt);
  }

  async singIn(user) {
    return await this.authService.signIn({
      id: user.id.toString(),
    });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
