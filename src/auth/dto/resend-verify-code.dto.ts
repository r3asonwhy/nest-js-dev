import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResendVerifyCodeDto {
  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR'),
  })
  @Matches(/^\+?[1-9]\d{11,14}$/, {
    message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR'),
  })
  phone: string;
}
