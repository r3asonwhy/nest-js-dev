import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user (optional)' })
  @IsOptional()
  @Matches(/^\+?[1-9]\d{11,14}$/, { message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR') })
  phone?: string;

  @ApiProperty({ example: 'user@mailinator.com', description: 'Email address of the user (optional)' })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.auth.EMAIL_FORMAT_ERROR') })
  email?: string;

  @ApiProperty({
    example: 'Secure@Pass123!',
    description: 'Password with at least one letter, one number, and one special character',
  })
  @IsString({ message: i18nValidationMessage('validation.auth.INVALID_PASSWORD_FORMAT') })
  @ValidateIf((o) => o.password && o.password.length < 12, {
    message: i18nValidationMessage('validation.auth.PASSWORD_TOO_SHORT'),
  })
  @ValidateIf((o) => o.password && o.password.length > 99, {
    message: i18nValidationMessage('validation.auth.PASSWORD_TOO_LONG'),
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/, {
    message: i18nValidationMessage('validation.auth.PASSWORD_STRENGTH_ERROR'),
  })
  password: string;
}