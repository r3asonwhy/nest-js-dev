import { Injectable } from '@nestjs/common';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { CognitoCreateUserResponse, CognitoTokenResponse } from '../interfaces/auth.interfaces';
import { CognitoConfigService } from '@/config/cognito/config.service';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { JwtService } from '@nestjs/jwt';
import { ERROR_CODES } from '@/common/error-constants';

@Injectable()
export class CognitoService {
  private userPool: CognitoUserPool;
  private awsClient: AWS.CognitoIdentityServiceProvider;

  constructor(
    private readonly cognitoConfigService: CognitoConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.cognitoConfigService.userPoolId,
      ClientId: this.cognitoConfigService.clientId,
    });

    AWS.config.update({
      region: this.cognitoConfigService.region,
      credentials: {
        accessKeyId: this.cognitoConfigService.accessKeyId,
        secretAccessKey: this.cognitoConfigService.secretAccessKey,
      },
    });

    this.awsClient = new AWS.CognitoIdentityServiceProvider();
  }

  async createUserCognito(username: string, password: string): Promise<CognitoCreateUserResponse> {
    if (!username || !password) {
      throw await I18nHttpException.create('SRV-CGN-1', ERROR_CODES.USER_CREATION_ERROR);
    }

    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, null, null, async (err, result) => {
        if (err) {
          let errorCode;
    
          if (typeof err === 'object' && 'code' in err) {
            switch ((err as any).code) {
              case 'InvalidPasswordException':
                errorCode = ERROR_CODES.INVALID_PASSWORD_POLICY;
                break;
              case 'UsernameExistsException':
                errorCode = ERROR_CODES.EMAIL_EXISTS;
                break;
              default:
                errorCode = ERROR_CODES.UNKNOWN_ERROR;
            }
          } else {
            errorCode = ERROR_CODES.UNKNOWN_ERROR;
          }
    
          reject(
            await I18nHttpException.create('SRV-CGN-2', errorCode, { error: err.message })
          );
        } else {
          resolve({ userSub: result.userSub, username: result.user.getUsername() });
        }
      });
    });
  }

  async signInUserCognito(username: string, password: string): Promise<CognitoTokenResponse> {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          resolve({
            refresh_token: session.getRefreshToken().getToken(),
            access_token: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
          });
        },
        onFailure: async (err) => {
          try {
            const exception = await I18nHttpException.create('SRV-CGN-3', ERROR_CODES.INVALID_CREDENTIALS);
            reject(exception);
          } catch (createError) {
            reject(createError);
          }
        },
      });
    });
  }

  async refreshTokenCognito(username: string, refresh_token: string): Promise<CognitoTokenResponse> {
    const cognitoRefreshToken = new CognitoRefreshToken({
      RefreshToken: refresh_token,
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(cognitoRefreshToken, (err, session) => {
        if (err) reject(err);
        resolve({
          refresh_token: session.getRefreshToken().getToken(),
          access_token: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
        });
      });
    });
  }

  async deleteUserFromCognito(username: string): Promise<void> {
    try {
      await this.awsClient
        .adminDeleteUser({
          UserPoolId: this.cognitoConfigService.userPoolId,
          Username: username,
        })
        .promise();
    } catch (error) {
      console.error('Error deleting user from Cognito:', error);
      throw await I18nHttpException.create('SRV-CGN-4', ERROR_CODES.DELETE_COGNITO_FAILED);
    }
  }

  async confirmUser(username: string) {
    const params = {
        UserPoolId: process.env.AWS_COGNITO_POOL_ID,
        Username: username,
    };
    return new Promise((resolve, reject) => {
        this.awsClient.adminConfirmSignUp(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    try {
      await this.awsClient
        .adminSetUserPassword({
          UserPoolId: this.cognitoConfigService.userPoolId,
          Username: email,
          Password: newPassword,
          Permanent: true,
        })
        .promise();
    } catch (error) {
      console.error('Error updating password in Cognito:', error);
      throw await I18nHttpException.create('SRV-CGN-5', ERROR_CODES.FAILED_TO_UPDATE_PASSWORD);
    }
  }
  
  async updateAttributes(email: string, attributes: { Name: string; Value: string }[]): Promise<void> {
    try {
      await this.awsClient
        .adminUpdateUserAttributes({
          UserPoolId: this.cognitoConfigService.userPoolId,
          Username: email,
          UserAttributes: attributes,
        })
        .promise();
    } catch (error) {
      console.error('Error updating attributes in Cognito:', error);
      throw await I18nHttpException.create('SRV-CGN-6', ERROR_CODES.FAILED_TO_UPDATE_USER_ATTRIBUTES);
    }
  }

  async globalSignOut(access_token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.awsClient.globalSignOut({ AccessToken: access_token }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async verifyTokenInCognito(access_token: string): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(access_token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }

  async setNewPassword(email: string, newPassword: string): Promise<void> {
    try {
      await this.awsClient
        .adminSetUserPassword({
          UserPoolId: this.cognitoConfigService.userPoolId,
          Username: email,
          Password: newPassword,
          Permanent: true,
        })
        .promise();
    } catch (error) {
      console.error('Error updating password in Cognito:', error);
      throw new Error('Failed to set new password in Cognito');
    }
  }
}
