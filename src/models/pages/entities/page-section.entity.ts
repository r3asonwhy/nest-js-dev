import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Page } from './page.entity';

@Table({ tableName: 'page_content', timestamps: false })
export class PageSection extends Model<PageSection> {
  @ApiProperty({ example: 1, description: 'Unique identifier for the page content' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Page)
  @ApiProperty({ example: 1, description: 'Foreign key referencing the Page' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  page_id: number;

  @ApiProperty({
    example: {
      title: 'Section Title',
      text: 'Content for the section',
      link: '/example-link',
      image_id: 12345,
      group_number: 5
    },
    description: 'JSON object storing all section-related data'
  })
  @Column({ type: DataType.JSON, allowNull: false })
  content: object;

  @ApiProperty({ example: 1, description: 'Section type or category' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  type: number;
}
