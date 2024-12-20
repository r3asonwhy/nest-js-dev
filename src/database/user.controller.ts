import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route to create a user
  @Post()
  async create(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.createUser(username, email, password);
  }

  // Route to get all users
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
