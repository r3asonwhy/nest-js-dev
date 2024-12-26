import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { User } from '@/models/users/entities/user.entity';
import { Config } from '@/models/configs/entities/config.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Config) private readonly configModel: typeof Config,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async getDashboard(): Promise<DashboardResponseDto> {
    const result: DashboardResponseDto = {
      users: await this.userModel.count()
    };

    return result;
  }
}
