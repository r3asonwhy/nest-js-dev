import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // Method to create a user
  async createUser(username: string, email: string, password: string): Promise<User> {
    return this.userModel.create({ username, email, password });
  }

  // Method to find all users
  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  // Method to find user by ID
  async findOne(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }
}
