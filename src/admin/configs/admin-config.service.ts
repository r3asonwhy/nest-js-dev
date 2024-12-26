import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ConfigResponseDto } from '@/admin/configs/dto/config-response.dto';
import { Config } from '@/models/configs/entities/config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CreateConfigDto } from './dto/create-config.dto';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '@/common/error-constants';

@Injectable()
export class AdminConfigService {
  constructor(
    @InjectModel(Config) private readonly configModel: typeof Config
  ) {}

  async createConfig(data: CreateConfigDto[]): Promise<ConfigResponseDto[]> {
    const langDefault = 'en';
    const createdConfigs = [];

    for (const item of data) {
      const lang = item.lang || langDefault;
      await this.configModel.create({
        type: item.key,
        value: item.value,
        lang,
        updated_at: new Date(),
      });

      createdConfigs.push({
        key: item.key,
        value: item.value,
        lang,
      });
    }

    return createdConfigs;
  }

  async updateConfig(data: UpdateConfigDto[]): Promise<ConfigResponseDto[]> {
    const langDefault = 'en';

    for (const item of data) {
      const lang = item.lang || langDefault;

      const exists = await this.configModel.count({ where: { type: item.key, lang } });
      if (exists) {
        await this.configModel.update(
          { value: item.value, lang, updated_at: new Date() },
          { where: { type: item.key, lang } },
        );
      } else {
        throw await I18nHttpException.create('SRV-CNF-1', ERROR_CODES.CONFIG_KEY_NOT_EXIST);
      }
    }

    const keys = data.map((item) => item.key);
    const updatedConfigs = await this.configModel.findAll({
      where: { type: { [Op.in]: keys } },
      raw: true,
    });

    return updatedConfigs.map((config) => ({
      key: config.type,
      value: config.value,
      lang: config.lang,
    }));
  }

  async getConfigs(): Promise<ConfigResponseDto[]> {
    const resultConfigs = await this.configModel.findAll({ raw: true });

    return resultConfigs.map((item) => ({
      key: item.type,
      value: item.value,
      lang: item.lang,
      updated_at: item.updated_at
    }));
  }
}
