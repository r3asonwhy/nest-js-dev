import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { IToken } from '../interfaces/token.interface';

@Table({ tableName: 'session', timestamps: false })
export class Token extends Model<Token> implements IToken {
  @ApiProperty({ example: 1, description: 'ID of the user who owns the token' })
  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...', description: 'Access token for the user' })
  @Column({ type: DataType.TEXT })
  access_token!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...', description: 'Refresh token for the user' })
  @Column({ type: DataType.TEXT })
  refresh_token!: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', description: 'Expiration time of the access token' })
  @Column({ type: DataType.DATE })
  expires_at!: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  device_id: string;
}
