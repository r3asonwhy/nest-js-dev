import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'config', timestamps: false })
export class Config extends Model<Config> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier for the configuration',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({
    example: 'currency',
    description: 'The key for the configuration',
  })
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'The key for the configuration',
  })
  type: string;

  @ApiProperty({
    example: '44.5',
    description: 'The value for the configuration',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'The value for the configuration',
  })
  value: string;

  @ApiProperty({ example: 'en', description: 'Language of the configuration' })
  @Column({
    type: DataType.STRING(10),
    allowNull: true,
    comment: 'Language code for the configuration',
  })
  lang: string;

  @ApiProperty({
    example: '2024-12-16T21:11:18Z',
    description: 'Timestamp when the configuration was last updated',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: () => new Date().toISOString(),
  })
  updated_at: Date;
}
