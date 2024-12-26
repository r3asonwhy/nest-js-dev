import { IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdatePasswordDto {
  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')
  })
  @Matches(/^\+?[1-9]\d{11,14}$/, { message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR') })
  phone: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'New password with at least one letter, one number, and one special character',
    required: true,
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
  new_password: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'Confirmation of the new password (must match the new_password field)',
    required: true,
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
  confirm_new_password: string;
}
