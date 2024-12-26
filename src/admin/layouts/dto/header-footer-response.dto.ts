import { ApiProperty } from '@nestjs/swagger';

class IconDto {
  @ApiProperty({ example: 1, description: 'ID of the uploaded file' })
  id: number;

  @ApiProperty({ example: 0, description: 'Origin ID of the uploaded file' })
  origin_id: number;
}

export class HeaderFooterResponseDto {
  @ApiProperty({ type: IconDto, description: 'Header logo file' })
  header_logo?: IconDto;

  @ApiProperty({ type: IconDto, description: 'Footer logo file' })
  footer_logo?: IconDto;

  @ApiProperty({ example: '123 Main Street, City, Country', description: 'Address text' })
  address?: string;

  @ApiProperty({ example: '© 2024 MyCompany. All rights reserved.', description: 'Copyright text' })
  copyright?: string;

  @ApiProperty({
    type: [Object],
    example: [{ icon: { id: 4, origin_id: 0 }, link: 'https://facebook.com/mycompany' }],
    description: 'Social network links with icons',
  })
  social_network?: { icon: IconDto; link: string }[];

  @ApiProperty({ example: ['+123456789', '+987654321'], description: 'List of phone numbers' })
  phones?: string[];

  @ApiProperty({ type: IconDto, description: 'Phones icon file' })
  phones_icon?: IconDto;

  @ApiProperty({ example: 'Mon-Fri 9:00 AM - 5:00 PM', description: 'Schedule text' })
  schedule?: string;

  @ApiProperty({ type: IconDto, description: 'Schedule icon file' })
  schedule_icon?: IconDto;
}
