import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class IconLinkDto {
  @ApiProperty({ example: 123, description: 'ID of the icon file' })
  @IsOptional()
  id: number;

  @ApiProperty({ example: 0, description: 'Origin ID of the icon file' })
  @IsOptional()
  origin_id: number;
}

class SocialNetworkDto {
  @ApiProperty({ description: 'Icon details', type: IconLinkDto })
  @ValidateNested()
  @Type(() => IconLinkDto)
  icon: IconLinkDto;

  @ApiProperty({ example: 'https://social.com', description: 'Social network link' })
  @IsString()
  link: string;
}

export class SaveHeaderFooterDto {
  @ApiProperty({ description: 'Header logo file', type: IconLinkDto })
  @ValidateNested()
  @Type(() => IconLinkDto)
  @IsOptional()
  header_logo?: IconLinkDto;

  @ApiProperty({ description: 'Footer logo file', type: IconLinkDto })
  @ValidateNested()
  @Type(() => IconLinkDto)
  @IsOptional()
  footer_logo?: IconLinkDto;

  @ApiProperty({ description: 'Phone icon file', type: IconLinkDto })
  @ValidateNested()
  @Type(() => IconLinkDto)
  @IsOptional()
  phones_icon?: IconLinkDto;

  @ApiProperty({ description: 'Schedule icon file', type: IconLinkDto })
  @ValidateNested()
  @Type(() => IconLinkDto)
  @IsOptional()
  schedule_icon?: IconLinkDto;

  @ApiProperty({ example: ['+123456789', '+987654321'], description: 'List of phone numbers' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  phones?: string[];

  @ApiProperty({ example: '123 Main Street', description: 'Address text' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: '© 2024 MyCompany', description: 'Copyright text' })
  @IsString()
  @IsOptional()
  copyright?: string;

  @ApiProperty({ description: 'Social network links', type: [SocialNetworkDto] })
  @ValidateNested({ each: true })
  @Type(() => SocialNetworkDto)
  @IsOptional()
  social_network?: SocialNetworkDto[];

  @ApiProperty({ example: 'Mon-Fri 9:00 AM - 5:00 PM', description: 'Schedule text' })
  @IsString()
  @IsOptional()
  schedule?: string;

  @ApiProperty({ example: 'en', description: 'Language' })
  @IsString()
  @IsOptional()
  lang?: string;
}
