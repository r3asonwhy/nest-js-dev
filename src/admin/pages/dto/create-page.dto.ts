import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for section content
export class SectionContentDto {
  @ApiProperty({ example: 'Title', description: 'Title of the content' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'This is some text.', description: 'Text content of the section' })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: '/video-link', description: 'Video link' })
  @IsString()
  @IsOptional()
  video_link?: string;

  @ApiProperty({ example: 12345, description: 'Image ID' })
  @IsInt()
  @IsOptional()
  image_id?: number;

  @ApiProperty({ example: '/link', description: 'Link URL' })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ example: 'Learn More', description: 'Link title' })
  @IsString()
  @IsOptional()
  link_title?: string;
}

// DTO for blocks (if the section has blocks)
export class BlockDto {
  @ApiProperty({ example: 1001, description: 'Block image ID' })
  @IsInt()
  block_image_id: number;

  @ApiProperty({ example: 'Block Title', description: 'Title of the block' })
  @IsString()
  block_title: string;

  @ApiProperty({ example: 'Block description', description: 'Text description for the block' })
  @IsString()
  block_text: string;
}

// DTO for page section
export class SectionDto {
  @ApiProperty({ example: 18, description: 'Section type ID' })
  @IsInt()
  @Type(() => Number)
  type: number;

  @ApiProperty({
    description: 'Content of the section as a JSON object',
    example: {
      title: 'Welcome Section',
      text: 'This is a welcome section',
      image_id: 12345,
      link: '/more-info',
      link_title: 'Learn More'
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => SectionContentDto)
  content: SectionContentDto;
}

// Main DTO to create the page
export class CreatePageDto {
  @ApiProperty({ example: 'Home Page', description: 'Title of the page' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'uk', description: 'Language of the page' })
  @IsString()
  lang: string;

  @ApiProperty({ example: 'marketing', description: 'Type/category of the page' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'home', description: 'Template name' })
  @IsString()
  template: string;

  @ApiProperty({ example: 1, description: 'Status of the page' })
  @IsInt()
  status: number;

  @ApiProperty({ example: 'custom-slug', description: 'Custom slug for the page', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 1, description: 'ID for updating the page', required: false })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty({
    type: [SectionDto],
    description: 'An array of sections, each with type and content'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}

