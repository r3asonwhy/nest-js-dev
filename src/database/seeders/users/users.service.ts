import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/models/users/entities/user.entity';
import { initialUsers } from './data';

@Injectable()
export class UserSeederService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async seed() {
    for (const user of initialUsers) {
      const userExists = await this.userModel.findOne({ where: { email: user.email } });
      if (!userExists) {
        await this.userModel.create(user);
      }
    }
  }
}
