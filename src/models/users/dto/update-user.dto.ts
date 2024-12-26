import { IsString, IsEmail, IsOptional, Matches, IsEnum, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRole, UserStatus } from '@/common/constants';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsOptional()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsOptional()
  last_name: string;

  @ApiProperty({ example: 'user@mailinator.com', description: 'Email address of the user' })
  @IsEmail({}, {
    message: i18nValidationMessage('validation.auth.EMAIL_FORMAT_ERROR')
  })
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'Secure@Pass123!', description: 'Password with at least one letter, one number, and one special character' })
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
  @IsOptional()
  password: string;

  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user' })
  @Matches(/^\+?[1-9]\d{11,14}$/, { message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR') })
  @IsOptional()
  phone: string;

  @ApiProperty({ example: 'Admin', description: 'Role of the user', required: false })
  @IsEnum(UserRole, { message: i18nValidationMessage('validation.user.INVALID_ROLE') })
  @IsOptional()
  role: UserRole;

  @ApiProperty({ example: 'Pending', description: 'Status of the user', required: false })
  @IsEnum(UserStatus, { message: i18nValidationMessage('validation.user.INVALID_STATUS') })
  @IsOptional()
  status: UserStatus;
}