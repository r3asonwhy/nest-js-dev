import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './entities/token.entity';
import { Transaction } from 'sequelize';
import { TokenData, UpdateTokenData } from './interfaces/token.interface';
import { AppConfigService } from '@/config/app/config.service';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '@/common/error-constants';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token) private readonly tokenModel: typeof Token,
    private readonly appConfigService: AppConfigService
  ) {}

  async saveToken(data: TokenData): Promise<void> {
    try {
      const { user_id, device_id } = data;
      const tokenData = await this.tokenModel.findOne({ where: { user_id, device_id } });

      if (tokenData) {
        await tokenData.update(data);
      } else {
        await this.tokenModel.create(data);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      throw await I18nHttpException.create('SRV-TOK-1', ERROR_CODES.TOKEN_SAVE_FAILED);
    }
  }

  async deleteToken(id: number): Promise<void> {
    try {
      await this.tokenModel.destroy({ where: { id } });
    } catch (error) {
      console.error('Error deleting token:', error);
      throw await I18nHttpException.create('SRV-TOK-2', ERROR_CODES.TOKEN_DELETE_FAILED);
    }
  }

  async getTokenByAccessToken(access_token: string): Promise<Token | null> {
    try {
      return await this.tokenModel.findOne({ where: { access_token } });
    } catch (error) {
      console.error('Error fetching token by access_token:', error);
      throw await I18nHttpException.create('SRV-TOK-3', ERROR_CODES.TOKEN_FETCH_FAILED);
    }
  }

  async updateAccessToken(user_id: number, newAccessToken: string): Promise<void> {
    const ttlInMilliseconds = parseInt(this.appConfigService.accessTokenTtl, 10) * 60 * 60 * 1000;
  
    const [updatedRows] = await this.tokenModel.update(
      { access_token: newAccessToken, expires_at: new Date(Date.now() + ttlInMilliseconds) },
      { where: { user_id } },
    );
  
    if (updatedRows === 0) {
      throw await I18nHttpException.create('SRV-TOK-4', ERROR_CODES.TOKEN_NOT_FOUND, { user_id });
    }
  }

  async updateTokens(id: number, data: UpdateTokenData, transaction?: Transaction): Promise<void> {
    try {
      await this.tokenModel.update(data, { where: { id }, transaction });
    } catch (error) {
      console.error('Error updating tokens:', error);
      throw await I18nHttpException.create('SRV-TOK-5', ERROR_CODES.TOKEN_UPDATE_FAILED);
    }
  }

  async deleteTokensByUserId(user_id: number, transaction?: Transaction): Promise<void> {
    try {
      await this.tokenModel.destroy({
        where: { user_id },
        transaction,
      });
    } catch (error) {
      console.error('Error deleting tokens by user_id:', error);
      throw await I18nHttpException.create('SRV-TOK-6', ERROR_CODES.TOKEN_DELETE_FAILED);
    }
  }

  async getTokenByAccessTokenAndDevice(access_token: string, device_id: string): Promise<Token | null> {
    return await this.tokenModel.findOne({ where: { access_token, device_id } });
  }
}
