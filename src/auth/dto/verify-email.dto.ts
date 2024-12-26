import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@mailinator.com', description: 'Email address of the user' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')})
  @IsEmail({}, { message: i18nValidationMessage('validation.auth.EMAIL_FORMAT_ERROR')})
  email: string;

  @ApiProperty({ example: '1234', description: 'Verification code' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR'),
  })
  @Length(4, 4, {
    message: i18nValidationMessage('validation.auth.CODE_LENGTH_ERROR'),
  })
  code: string;
}
