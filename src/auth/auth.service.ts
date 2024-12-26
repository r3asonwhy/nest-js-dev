import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/models/users/user.service';
import { LoginDto } from './dto/login.dto';
import { AppConfigService } from '@/config/app/config.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CognitoService } from './cognito/cognito.service';
import { Sequelize } from 'sequelize-typescript';
import { generateOneTimeCode } from '@/common/utils/extra.util';
import { AuthResponse, ResendPhoneInput, VerifyCodeInput } from './interfaces/auth.interfaces';
import { CodeType } from '@/common/constants';
import { I18nService } from 'nestjs-i18n';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import * as jwt from 'jsonwebtoken';
import { CognitoConfigService } from '@/config/cognito/config.service';
import jwksClient from 'jwks-rsa';
import { TokenService } from '@/models/tokens/token.service';
import { LogService } from '@/models/logs/log.service';
import { ERROR_CODES } from '@/common/error-constants';
import { NotificationService } from '@/notifications/notification.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly cognitoService: CognitoService,
    private readonly sequelize: Sequelize,
    private readonly i18nService: I18nService,
    private readonly cognitoConfigService: CognitoConfigService,
    private tokenService: TokenService,
    private readonly logService: LogService,
    private readonly notificationService: NotificationService,
  ) {}

  async login(loginDto: LoginDto, deviceId: string): Promise<AuthResponse> {
    const { phone, email, password } = loginDto;
    let user;
  
    if (phone) {
      user = await this.userService.findUser({ phone });
    } else if (email) {
      user = await this.userService.findUser({ email });
    }
  
    if (!user) {
      throw await I18nHttpException.create('SRV-ATH-1', ERROR_CODES.INVALID_CREDENTIALS);
    }
  
    if (!user.email_verified) {
      throw await I18nHttpException.create('SRV-ATH-2', ERROR_CODES.EMAIL_NOT_VERIFIED);
    }
  
    const { access_token, refresh_token } = await this.cognitoService.signInUserCognito(user.email, password);
    const expires_at = await this.calculateTokenExpiration(access_token);
  
    await this.tokenService.saveToken({
      user_id: user.id,
      access_token,
      refresh_token,
      device_id: deviceId,
      expires_at,
    });
  
    return { access_token };
  }

  async logout(access_token: string | undefined, device_id: string): Promise<void> {
    const tokenData = await this.tokenService.getTokenByAccessTokenAndDevice(access_token, device_id);
    if (!tokenData) {
      throw await I18nHttpException.create('SRV-ATH-3', ERROR_CODES.INVALID_DEVICE_OR_TOKEN);
    }
  
    try {
      await this.tokenService.deleteToken(tokenData.id);
  
      const isTokenActive = await this.cognitoService.verifyTokenInCognito(access_token);
      if (isTokenActive) {
        await this.cognitoService.globalSignOut(access_token);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw await I18nHttpException.create('SRV-ATH-4', ERROR_CODES.LOGOUT_FAILED);
    }
  }
  
  async refreshTokens(access_token: string | undefined, device_id: string): Promise<AuthResponse> {
    if (!access_token) {
      throw await I18nHttpException.create('SRV-ATH-5', ERROR_CODES.NO_ACCESS_TOKEN);
    }

    const tokenData = await this.tokenService.getTokenByAccessTokenAndDevice(access_token, device_id);
    if (!tokenData) {
      throw await I18nHttpException.create('SRV-ATH-6', ERROR_CODES.INVALID_TOKEN);
    }

    const user = await this.userService.findOne(tokenData.user_id);
    if (!user) {
      throw await I18nHttpException.create('SRV-ATH-7', ERROR_CODES.USER_NOT_FOUND);
    }
  
    const transaction = await this.sequelize.transaction();
    try {
      const { access_token: newAccessToken, refresh_token } = await this.cognitoService.refreshTokenCognito(user.email, tokenData.refresh_token);
      const expires_at = await this.calculateTokenExpiration(access_token);

      await this.tokenService.updateTokens(
        tokenData.id,
        {
          access_token: newAccessToken,
          refresh_token,
          expires_at
        },
        transaction,
      );

      await transaction.commit();

      return { access_token: newAccessToken };
    } catch (error) {
      await transaction.rollback();
      console.error('Error refreshing tokens:', error);
      throw await I18nHttpException.create('SRV-ATH-8', ERROR_CODES.ERROR_REFRESHING_TOKENS);
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userService.findUser({ email, confirmation_code: code }, null, transaction);

      if (!user) {
        throw await I18nHttpException.create('SRV-ATH-9', ERROR_CODES.INVALID_CODE);
      }

      if (!user.confirmation_code_type || user.confirmation_code_type !== CodeType.REGISTER) {
        throw await I18nHttpException.create('SRV-ATH-10', ERROR_CODES.INVALID_TOKEN_TYPE);
      }

      if (user.confirmation_code_expires && new Date(user.confirmation_code_expires).getTime() < Date.now()) {
        throw await I18nHttpException.create('SRV-ATH-11', ERROR_CODES.CODE_EXPIRED);
      }

      await this.cognitoService.confirmUser(user.email)

      await this.userService.updateUser(
        user,
        {
          confirmation_code: '',
          confirmation_code_type: '',
          confirmation_code_expires: null,
          email_verified: true,
        },
        transaction
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findUser({ phone: dto.phone });
    if (!user) {
      throw await I18nHttpException.create('SRV-ATH-12', ERROR_CODES.USER_NOT_FOUND);
    }
  
    const { code, expires_at } = await generateOneTimeCode();
  
    await user.update({
      confirmation_code: code,
      confirmation_code_type: CodeType.RESET_PASSWORD,
      confirmation_code_expires: expires_at,
    });

    const message = await this.i18nService.translate('texts.sms.PASSWORD_RESET_CODE', { args: { code } });

    await this.notificationService.sendNotification({
      to: user.phone,
      message,
      type: 'sms',
    });
  }

  async verifyCode(data: VerifyCodeInput, platform: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
  
    try {
      const user = await this.userService.findUser(
        { phone: data.phone, confirmation_code: data.code },
        null,
        transaction
      );
  
      if (!user) {
        throw await I18nHttpException.create('SRV-ATH-13', ERROR_CODES.INVALID_CODE);
      }
  
      if (!user.confirmation_code_type) {
        throw await I18nHttpException.create('SRV-ATH-14', ERROR_CODES.INVALID_TOKEN_TYPE);
      }
  
      if (user.confirmation_code_expires && new Date(user.confirmation_code_expires).getTime() < Date.now()) {
        throw await I18nHttpException.create('SRV-ATH-15', ERROR_CODES.CODE_EXPIRED);
      }
  
      await this.userService.updateUser(
        user,
        {
          confirmation_code: '',
          confirmation_code_type: '',
          confirmation_code_expires: null,
        },
        transaction
      );
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async resendVerifyCode(dto: ResendPhoneInput): Promise<void> {
    const user = await this.userService.findUser({ phone: dto.phone });
    if (!user) {
      throw await I18nHttpException.create('SRV-ATH-16', ERROR_CODES.USER_NOT_FOUND);
    }
  
    const { code, expires_at } = await generateOneTimeCode();
  
    await user.update({
      confirmation_code: code,
      confirmation_code_type: CodeType.RESET_PASSWORD,
      confirmation_code_expires: expires_at,
    });
  
    const message = await this.i18nService.translate('texts.sms.VERIFICATION_CODE', { args: { code } });
  
    try {
      await this.notificationService.sendNotification({
        to: dto.phone,
        message,
        type: 'sms',
      });
    } catch (error) {
      throw await I18nHttpException.create('SRV-ATH-17', ERROR_CODES.SEND_SMS_FAILED);
    }
  }

  async resetPassword(dto: UpdatePasswordDto): Promise<void> {
    const { phone, new_password, confirm_new_password } = dto;

    if (new_password !== confirm_new_password) {
      throw await I18nHttpException.create('SRV-ATH-18', ERROR_CODES.PASSWORD_MISMATCH);
    }

    const user = await this.userService.findUser({ phone });
    if (!user) {
      throw await I18nHttpException.create('SRV-ATH-19', ERROR_CODES.USER_NOT_FOUND);
    }

    try {
      await this.cognitoService.setNewPassword(user.email, new_password);
    } catch (error) {
      throw await I18nHttpException.create('SRV-ATH-20', ERROR_CODES.COGNITO_ERROR, { error: error.message });
    }

    await user.update({
      confirmation_code: null,
      confirmation_code_type: null,
      confirmation_code_expires: null,
    });

    const localizedTexts = {
      subject: await this.i18nService.translate('texts.mail.PASSWORD_SUCCESSFULLY_UPDATED'),
      greeting: await this.i18nService.translate('texts.mail.PASSWORD_UPDATED_GREETING', { args: { firstName: user.first_name } }),
      message: await this.i18nService.translate('texts.mail.PASSWORD_UPDATED_MESSAGE'),
    };
  
    await this.notificationService.sendNotification({
      to: user.email,
      type: 'email',
      template: 'resetPassword',
      context: localizedTexts,
    });
  }

  async verifyToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const getKeyWithBoundContext = this.getKey.bind(this);
  
      jwt.verify(token, getKeyWithBoundContext, { algorithms: ['RS256'] }, async (err, decoded) => {
        if (err) {
          let errorCode;
  
          if (typeof err === 'object' && 'name' in err) {
            switch (err.name) {
              case 'TokenExpiredError':
                errorCode = ERROR_CODES.TOKEN_EXPIRED;
                break;
              case 'JsonWebTokenError':
                errorCode = ERROR_CODES.INVALID_TOKEN;
                break;
              default:
                errorCode = ERROR_CODES.UNKNOWN_ERROR;
            }
          } else {
            errorCode = ERROR_CODES.UNKNOWN_ERROR;
          }
  
          reject(
            await I18nHttpException.create('SRV-ATH-19', errorCode, { error: err.message })
          );
        } else {
          resolve(decoded);
        }
      });
    });
  }

  private async calculateTokenExpiration(access_token: string): Promise<Date> {
    const decodedToken = this.jwtService.decode(access_token) as { exp: number };
    if (!decodedToken || !decodedToken.exp) {
      throw await I18nHttpException.create('SRV-ATH-21', ERROR_CODES.INVALID_TOKEN);
    }
    return new Date(decodedToken.exp * 1000);
  }

  private getKey(header, callback) {
    const jwksUri = this.cognitoConfigService.jwksUri;
    const client = jwksClient({ jwksUri });
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }
}
