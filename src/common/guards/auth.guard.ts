import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { UserService } from '@/models/users/user.service';
import { RequestWithUser } from '../interfaces/request.interface';
import { ERROR_CODES } from '../error-constants';
import { setCookie } from '../helpers/token.helper';
import { Response } from 'express';
import { COOKIE_MAX_AGE, CustomHttpStatus } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private readonly publicPages = ['home', 'localization/errors'];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const response = context.switchToHttp().getResponse();
    const token = request.cookies?.jwt;
  
    const urlParts = request.url.split('/');
    const requestedPage = urlParts[urlParts.length - 1].split('?')[0];
  
    // If the page is public
    if (this.publicPages.includes(requestedPage)) {
      if (requestedPage === 'home' && token) {
        try {
          const cognitoUser = await this.authService.verifyToken(token);
          if (cognitoUser) {
            const user = await this.userService.findUser({ cognito_id: cognitoUser.username });
            if (user) {
              request.user = user;
            }
          }
        } catch (error) {
          // If the token is expired on the public page, we simply ignore it
          if (error.status === CustomHttpStatus.TOKEN_EXPIRED || error.message?.includes('jwt expired')) {
            try {
              const refreshResponse = await this.refreshToken(request, response);
              if (refreshResponse) {
                return true;
              }
            } catch (refreshError) {
              throw await I18nHttpException.create('GRD-AUT-4', ERROR_CODES.ERROR_REFRESHING_TOKENS, {
                message: refreshError.message,
              });
            }
          }
          throw error;
        }
      }
      return true;
    }
  
    if (!token) {
      throw await I18nHttpException.create('GRD-AUT-1', ERROR_CODES.NO_JWT_FOUND);
    }
  
    try {
      const cognitoUser = await this.authService.verifyToken(token);
      if (!cognitoUser) {
        throw await I18nHttpException.create('GRD-AUT-2', ERROR_CODES.INVALID_OR_EXPIRED_TOKEN);
      }
  
      const user = await this.userService.findUser({ cognito_id: cognitoUser.username });
      if (!user) {
        throw await I18nHttpException.create('GRD-AUT-3', ERROR_CODES.USER_NOT_FOUND);
      }
  
      request.user = user;
      return true;
    } catch (error) {
      if (error.status === CustomHttpStatus.TOKEN_EXPIRED || error.message?.includes('jwt expired')) {
        try {
          const refreshResponse = await this.refreshToken(request, response);
          if (refreshResponse) {
            return true;
          }
        } catch (refreshError) {
          throw await I18nHttpException.create('GRD-AUT-4', ERROR_CODES.ERROR_REFRESHING_TOKENS, {
            message: refreshError.message,
          });
        }
      }
      throw error;
    }
  }
  
  // Function for updating the token
  private async refreshToken(request: RequestWithUser, response: Response): Promise<boolean> {
    const token = request.cookies?.jwt;
  
    if (!token) {
      throw await I18nHttpException.create('GRD-AUT-5', ERROR_CODES.NO_JWT_FOUND);
    }
  
    try {
      // API call to update the token
      const refreshResponse = await this.authService.refreshTokens(token, request.cookies['device_id']);
  
      if (refreshResponse && refreshResponse.access_token) {
        // Write the new token in the cookie
        setCookie(response, 'jwt', refreshResponse.access_token, {
          httpOnly: true,
          secure: true,
          maxAge: COOKIE_MAX_AGE,
        });
        return true;
      }
      return false;
    } catch (error) {
      throw await I18nHttpException.create('GRD-AUT-6', ERROR_CODES.ERROR_REFRESHING_TOKENS, {
        message: error.message,
      });
    }
  }
}
