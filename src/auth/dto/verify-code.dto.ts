import { IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyCodeDto {
  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR'),
  })
  @Matches(/^\+?[1-9]\d{11,14}$/, {
    message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR'),
  })
  phone: string;

  @ApiProperty({ example: '1234', description: 'Verification code' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR'),
  })
  @Length(4, 4, {
    message: i18nValidationMessage('validation.auth.CODE_LENGTH_ERROR'),
  })
  code: string;
}
