import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class FindUserDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  page?: number;

  @ApiPropertyOptional({ example: 15, description: 'Limit of results per page' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Limit must be an integer' })
  limit?: number;

  @ApiPropertyOptional({ example: 'John', description: 'Search string for filtering by name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'first_name', description: 'Field to sort by' })
  @IsOptional()
  @IsIn(['first_name', 'last_name', 'email', 'role'])
  sort_field?: string;

  @ApiPropertyOptional({ example: 'ASC', description: 'Sort direction (ASC or DESC)' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC';
}
