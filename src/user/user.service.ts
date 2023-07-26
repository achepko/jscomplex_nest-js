import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];
  constructor() {}

  async getAllUsers() {
    return this.users;
  }

  async createUser(data) {
    return this.users.push(data);
  }
  async getOneUserAccount(userId: string) {
    const user = this.users.find((item) => item.id === userId);
    return user;
  }
}
