import { Table, Column, Model, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { PageSection } from './page-section.entity';

@Table({ tableName: 'page', timestamps: false })
export class Page extends Model<Page> {
  @ApiProperty({ example: 1, description: 'Unique identifier for the page' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 0, description: 'Reference to the original page for translations' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  origin_id: number;

  @ApiProperty({ example: 'en', description: 'Language code for the page' })
  @Column({ type: DataType.STRING(5), allowNull: false })
  lang: string;

  @ApiProperty({ example: 'FAQ', description: 'Title of the page' })
  @Column({ type: DataType.STRING(255), allowNull: false })
  title: string;

  @ApiProperty({ example: 'marketing', description: 'Type/category of the page' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  type: string;

  @ApiProperty({ example: 'faq', description: 'Template used for the page' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  template: string;

  @ApiProperty({ example: 1, description: 'Status of the page (1 - Active, 0 - Inactive)' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  status: number;

  @ApiProperty({ example: '2024-01-01 12:00:00', description: 'Creation timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01 12:00:00', description: 'Update timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updated_at: Date;

  @ApiProperty({ example: 1, description: 'User ID who last updated the page' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by: number;

  @HasMany(() => PageSection)
  sections: PageSection[];
}
