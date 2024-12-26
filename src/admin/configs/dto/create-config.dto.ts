import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConfigDto {
  @ApiProperty({ example: 'currency', description: 'The key for the configuration' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: '44.5', description: 'The value for the configuration' })
  @IsString()
  value: string;

  @ApiProperty({ example: 'en', description: 'Language for the configuration', required: false })
  lang?: string;
}