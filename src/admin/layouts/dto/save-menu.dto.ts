import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class MenuItemDto {
  @ApiProperty({ example: 1, description: 'ID of the menu item' })
  id: number;

  @ApiProperty({ example: 'Home', description: 'Title of the menu item' })
  @IsString()
  title: string;

  @ApiProperty({ example: '/', description: 'Link of the menu item' })
  @IsString()
  link: string;
}

export class SaveMenuDto {
  @ApiProperty({
    description: 'Language of the menu configuration',
    example: 'en',
  })
  @IsString()
  lang: string;

  @ApiProperty({
    description: 'Menu configuration value',
    example: [
      { id: 1, title: 'Home', link: '/' },
      { id: 2, title: 'About', link: '/about' },
    ],
    type: [MenuItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  value: MenuItemDto[];
}
