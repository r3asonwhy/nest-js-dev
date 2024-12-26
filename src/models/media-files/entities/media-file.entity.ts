import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({ tableName: 'media_file', timestamps: false })
export class MediaFile extends Model<MediaFile> {
  @ApiProperty({ example: 1, description: 'Unique identifier for the media file' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @ApiProperty({
    example: 'e04f7f43-9061-453f-9bd2-f04e3b2e4011-image.jpg',
    description: 'Unique key of the file in S3 storage',
  })
  @Index({ name: 'idx_media_file_key', unique: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'The key (name) of the file stored in S3',
  })
  key: string;

  @ApiProperty({
    example: 'https://s3-bucket-url/e04f7f43-9061-453f-9bd2-f04e3b2e4011-image.jpg',
    description: 'Publicly accessible URL of the file',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'URL pointing to the file in S3 storage',
  })
  url: string;

  @ApiProperty({
    example: 'uploaded_by_user',
    description: 'Information about who uploaded the file',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: 'Identifier or source of the uploader',
  })
  uploaded_by: number;

  @ApiProperty({ example: '2024-12-11T12:00:00Z', description: 'Timestamp of when the file entry was created' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at: Date;
}
