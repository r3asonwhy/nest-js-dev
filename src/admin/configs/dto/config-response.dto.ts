import { ApiProperty } from '@nestjs/swagger';

export class ConfigResponseDto {
  @ApiProperty({
    example: 'currency',
    description: 'The key for the configuration',
  })
  key: string;

  @ApiProperty({
    example: '44.5',
    description: 'The value for the configuration',
  })
  value: string;

  @ApiProperty({ example: 'en', description: 'Language of the configuration' })
  lang: string;
}
