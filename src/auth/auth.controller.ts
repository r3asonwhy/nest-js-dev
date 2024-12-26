import {
  Controller,
  Post, Body,
  Res, HttpCode,
  HttpStatus,
  Delete,
  Req,
  Get,
  Param,
  UseGuards,
  Inject,
  applyDecorators,
  Headers,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import {
  loginSwagger,
  logoutSwagger,
  refreshSwagger,
  verifyEmailSwagger,
  resendVerifyEmailSwagger,
  forgotPasswordSwagger,
  resetPasswordSwagger,
  checkAuthSwagger,
  verifyCodeSwagger
} from './swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { I18nService } from 'nestjs-i18n';
import { UserService } from '@/models/users/user.service';
import { addHeaders } from '@/common/helpers/swagger-helper';
import { clearCookie, ensureDeviceId, setCookie } from '@/common/helpers/token.helper';
import { RequestWithUser } from '@/common/interfaces/request.interface';
import { CreateUserDto } from '@/models/users/dto/create-user.dto';
import { createUserSwagger } from '@/models/users/swagger';
import { ResendVerifyCodeDto } from './dto/resend-verify-code.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController { 
  constructor(
    private authService: AuthService,
    @Inject(I18nService) private readonly i18nService: I18nService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @applyDecorators(...addHeaders(createUserSwagger.headers))
  @ApiOperation(createUserSwagger.operation)
  @ApiBody(createUserSwagger.body)
  @ApiResponse(createUserSwagger.responses.success)
  @ApiResponse(createUserSwagger.responses.badRequest)
  @ApiResponse(createUserSwagger.responses.internalError)
  async register(@Body() createUserDto: CreateUserDto, @Headers('x-platform') platform: string): Promise<{ message: string }> {
    await this.userService.create(createUserDto, platform,);
    return { message: await this.i18nService.translate('texts.auth.REGISTRATION_SUCCESS') };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...addHeaders(loginSwagger.headers))
  @ApiOperation(loginSwagger.operation)
  @ApiBody(loginSwagger.body)
  @ApiResponse(loginSwagger.responses.success)
  @ApiResponse(loginSwagger.responses.badRequest)
  @ApiResponse(loginSwagger.responses.unauthorized)
  @ApiResponse(loginSwagger.responses.serviceUnavailable)
  @ApiResponse(loginSwagger.responses.internalError)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string, redirect: string }> {
    const deviceId = ensureDeviceId(req, res);
    const { access_token } = await this.authService.login(loginDto, deviceId);
    setCookie(res, 'jwt', access_token);
    const redirect = loginDto.email ? '/admin/news/list' : '/client/home';
    return { message: await this.i18nService.translate('texts.auth.LOGIN_SUCCESS'), redirect }
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(logoutSwagger.headers))
  @ApiOperation(logoutSwagger.operation)
  @ApiResponse(logoutSwagger.responses.success)
  @ApiResponse(logoutSwagger.responses.unauthorized)
  @ApiResponse(logoutSwagger.responses.databaseError)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string, redirect: string }> {
    const access_token = req.cookies['jwt'];
    const deviceId = ensureDeviceId(req, res);
    await this.authService.logout(access_token, deviceId);
    clearCookie(res, 'jwt');
    return { message: await this.i18nService.translate('texts.auth.LOGOUT_SUCCESS'), redirect: '/client/home' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @applyDecorators(...addHeaders(refreshSwagger.headers))
  @ApiOperation(refreshSwagger.operation)
  @ApiCookieAuth('jwt')
  @ApiResponse(refreshSwagger.responses.success)
  @ApiResponse(refreshSwagger.responses.unauthorized)
  @ApiResponse(refreshSwagger.responses.tokenNotProvided)
  @ApiResponse(refreshSwagger.responses.userNotFound)
  @ApiResponse(refreshSwagger.responses.refreshError)
  @ApiResponse(refreshSwagger.responses.databaseError)
  @ApiResponse(refreshSwagger.responses.updateError)
  @ApiResponse(refreshSwagger.responses.internalError)
  async refresh(@Req() req: Request, @Res() @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    const access_token = req.cookies['jwt'];
    const deviceId = ensureDeviceId(req, res);

    const { access_token: newAccessToken } = await this.authService.refreshTokens(access_token, deviceId);
    setCookie(res, 'jwt', newAccessToken);

    if (!req.cookies['device_id']) {
      setCookie(res, 'device_id', deviceId);
    }

    return { message: await this.i18nService.translate('texts.auth.TOKEN_REFRESHED') };
  }

  @Get('verify-email/:email/:code')
  @applyDecorators(...addHeaders(verifyEmailSwagger.headers))
  @ApiOperation(verifyEmailSwagger.operation)
  @ApiParam(verifyEmailSwagger.params.email)
  @ApiParam(verifyEmailSwagger.params.code)
  @ApiResponse(verifyEmailSwagger.responses.success)
  @ApiResponse(verifyEmailSwagger.responses.userNotFound)
  @ApiResponse(verifyEmailSwagger.responses.invalidTokenType)
  @ApiResponse(verifyEmailSwagger.responses.tokenExpired)
  @ApiResponse(verifyEmailSwagger.responses.internalError)
  async verifyEmail(
    @Param() params: VerifyEmailDto
  ): Promise<{ message: string }> {
    const { email, code } = params;
    await this.authService.verifyEmail(email, code);
    return { message: await this.i18nService.translate('texts.auth.EMAIL_VERIFIED_SUCCESS') };
  }

  @Post('forgot-password')
  @applyDecorators(...addHeaders(forgotPasswordSwagger.headers))
  @ApiOperation(forgotPasswordSwagger.operation)
  @ApiBody(forgotPasswordSwagger.body)
  @ApiResponse(forgotPasswordSwagger.responses.success)
  @ApiResponse(forgotPasswordSwagger.responses.userNotFound)
  @ApiResponse(forgotPasswordSwagger.responses.invalidEmail)
  @ApiResponse(forgotPasswordSwagger.responses.sendMailFailed)
  @ApiResponse(forgotPasswordSwagger.responses.internalError)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto);
    return { message: await this.i18nService.translate('texts.auth.PASSWORD_RESET_CODE_SENT') };
  }

  @Get('verify-code/:phone/:code')
  @applyDecorators(...addHeaders(verifyCodeSwagger.headers))
  @ApiOperation(verifyCodeSwagger.operation)
  @ApiParam(verifyCodeSwagger.params.phone)
  @ApiParam(verifyCodeSwagger.params.code)
  @ApiResponse(verifyCodeSwagger.responses.success)
  @ApiResponse(verifyCodeSwagger.responses.userNotFound)
  @ApiResponse(verifyCodeSwagger.responses.invalidTokenType)
  @ApiResponse(verifyCodeSwagger.responses.tokenExpired)
  @ApiResponse(verifyCodeSwagger.responses.internalError)
  async verifyCode(
    @Param() params: VerifyCodeDto,
    @Headers('x-platform') platform: string
  ): Promise<{ message: string }> {
    const { phone, code } = params;
    await this.authService.verifyCode({ phone, code }, platform);
    return { message: await this.i18nService.translate('texts.auth.CODE_VERIFIED_SUCCESS') };
  }

  @Get('resend-verify-code/:phone')
  @applyDecorators(...addHeaders(resendVerifyEmailSwagger.headers))
  @ApiOperation(resendVerifyEmailSwagger.operation)
  @ApiParam(resendVerifyEmailSwagger.params.phone)
  @ApiResponse(resendVerifyEmailSwagger.responses.success)
  @ApiResponse(resendVerifyEmailSwagger.responses.userNotFound)
  @ApiResponse(resendVerifyEmailSwagger.responses.emailAlreadyVerified)
  @ApiResponse(resendVerifyEmailSwagger.responses.invalidEmail)
  @ApiResponse(resendVerifyEmailSwagger.responses.sendMailFailed)
  @ApiResponse(resendVerifyEmailSwagger.responses.internalError)
  async resendVerifyCode(
    @Param('phone', new ValidationPipe({ transform: true })) dto: ResendVerifyCodeDto
  ): Promise<{ message: string }> {
    await this.authService.resendVerifyCode({ phone: dto.phone });
    return { message: await this.i18nService.translate('texts.auth.VERIFICATION_CODE_RESENT') };
  }

  @Post('reset-password')
  @applyDecorators(...addHeaders(resetPasswordSwagger.headers))
  @ApiOperation(resetPasswordSwagger.operation)
  @ApiBody(resetPasswordSwagger.body)
  @ApiResponse(resetPasswordSwagger.responses.success)
  @ApiResponse(resetPasswordSwagger.responses.badRequest)
  @ApiResponse(resetPasswordSwagger.responses.sendMailFailed)
  @ApiResponse(resetPasswordSwagger.responses.internalError)
  async resetPassword(@Body() dto: UpdatePasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: await this.i18nService.translate('texts.auth.PASSWORD_UPDATED') };
  }

  @Get('check-auth')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('jwt')
  @applyDecorators(...addHeaders(checkAuthSwagger.headers))
  @ApiOperation(checkAuthSwagger.operation)
  @ApiResponse(checkAuthSwagger.responses.success)
  @ApiResponse(checkAuthSwagger.responses.unauthorized)
  @ApiResponse(checkAuthSwagger.responses.tokenNotProvided)
  @ApiResponse(checkAuthSwagger.responses.internalError)
  checkIfLoggedIn(@Req() req: RequestWithUser): { logged_in: boolean, user_id?: number } {
    if (req.user) {
      return { logged_in: true, user_id: req.user.id };
    }
    return { logged_in: false };
  }
}
