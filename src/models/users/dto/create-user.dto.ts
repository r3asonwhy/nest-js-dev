import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, Matches, ValidateIf } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')
  })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')
  })
  last_name: string;

  @ApiProperty({ example: 'user@mailinator.com', description: 'Email address of the user' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')})
  @IsEmail({}, { message: i18nValidationMessage('validation.auth.EMAIL_FORMAT_ERROR')})
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
  password: string;

  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user' })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.user.REQUIRED_FIELD_EMPTY_ERROR')
  })
  @Matches(/^\+?[1-9]\d{11,14}$/, { message: i18nValidationMessage('validation.auth.PHONE_FORMAT_ERROR') })
  phone: string;
}
