import { ApiProperty } from '@nestjs/swagger';

class MenuItemDto {
  @ApiProperty({ example: 1, description: 'ID of the menu item' })
  id: number;

  @ApiProperty({ example: 'Home', description: 'Title of the menu item' })
  title: string;

  @ApiProperty({ example: '/', description: 'Link of the menu item' })
  link: string;
}

export class MenuResponseDto {
  @ApiProperty({ example: 3, description: 'Configuration ID' })
  id: number;

  @ApiProperty({ example: '2024-12-17T10:54:03Z', description: 'Last update timestamp' })
  updated_at: string;

  @ApiProperty({
    type: [MenuItemDto],
    description: 'Array of menu items',
    example: [
      { id: 1, title: 'Home', link: '/' },
      { id: 2, title: 'About', link: '/about' },
    ],
  })
  value: MenuItemDto[];
}
