import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SaveHeaderFooterDto } from './dto/save-header-footer.dto';
import { Config } from '@/models/configs/entities/config.entity';
import { HeaderFooterResponseDto } from './dto/header-footer-response.dto';
import { SaveMenuDto } from './dto/save-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '@/common/error-constants';

@Injectable()
export class LayoutService {
  constructor(
    @InjectModel(Config) private readonly configModel: typeof Config,
    private readonly sequelize: Sequelize,
  ) {}

  async saveHeaderFooter(data: SaveHeaderFooterDto): Promise<HeaderFooterResponseDto> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const { lang = 'en', ...configData } = data;

      const [updated] = await this.configModel.update(
        { value: JSON.stringify(configData), lang, updated_at: new Date() },
        { where: { type: 'header_footer', lang }, transaction },
      );

      if (!updated) {
        await this.configModel.create(
          {
            type: 'header_footer',
            value: JSON.stringify(configData),
            lang,
            updated_at: new Date(),
          },
          { transaction },
        );
      }

      const result = await this.configModel.findOne({
        where: { type: 'header_footer', lang },
        transaction,
      });

      await transaction.commit();
      return JSON.parse(result.value);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getHeaderFooter(lang: string = 'en'): Promise<HeaderFooterResponseDto> {
    const result = await this.configModel.findOne({
      where: { type: 'header_footer', lang },
    });

    if (!result) {
      throw await I18nHttpException.create('SRV-LYT-1', ERROR_CODES.HEADER_FOOTER_NOT_FOUND, { lang });
    }

    return JSON.parse(result.value) as HeaderFooterResponseDto;
  }

  async saveMenu(data: SaveMenuDto): Promise<any> {
    const { lang = 'en', value } = data;
  
    if (!value || value.length === 0) {
      throw await I18nHttpException.create('SRV-LYT-2', ERROR_CODES.MENU_VALUE_REQUIRED);
    }
  
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const existingConfig = await this.configModel.findOne({
        where: { type: 'menu', lang },
        transaction,
      });
  
      let result;
  
      if (existingConfig) {
        await this.configModel.update(
          { value: JSON.stringify(value) },
          { where: { type: 'menu', lang }, transaction },
        );
      } else {
        await this.configModel.create(
          {
            type: 'menu',
            lang,
            value: JSON.stringify(value),
            updated_at: new Date(),
          },
          { transaction },
        );
      }

      result = await this.configModel.findOne({
        where: { type: 'menu', lang },
        transaction,
      });
  
      if (result) {
        result.value = JSON.parse(result.value);
      }
  
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getMenu(lang: string): Promise<MenuResponseDto> {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const result = await this.configModel.findOne({
        where: { type: 'menu', lang },
        transaction,
      });
  
      if (!result) {
        throw await I18nHttpException.create('SRV-LYT-3', ERROR_CODES.MENU_NOT_FOUND, { lang });
      }
  
      const response: MenuResponseDto = {
        id: result.id,
        updated_at: result.updated_at.toISOString(),
        value: JSON.parse(result.value),
      };
  
      await transaction.commit();
      return response;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
