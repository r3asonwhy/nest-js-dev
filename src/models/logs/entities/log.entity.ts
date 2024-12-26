import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ILog } from '../interfaces/log.interface';

@Table({ tableName: 'log', timestamps: false })
export class Log extends Model<Log> implements ILog {
  @ApiProperty({ example: 1, description: 'Unique identifier of the log entry' })
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 123, description: 'ID of the user who performed the action', required: false })
  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id: number;

  @ApiProperty({ example: 'users', description: 'Name of the model affected by the action' })
  @Column({ type: DataType.STRING, allowNull: false })
  model: string;

  @ApiProperty({ example: 42, description: 'ID of the record in the affected model' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  model_id: number;

  @ApiProperty({
    example: '[{"action":"Updated field name","from":"John","to":"Doe"}]',
    description: 'Detailed description of the action performed',
    required: false,
  })
  @Column({ type: DataType.TEXT, allowNull: true })
  action: string;

  @ApiProperty({ example: 'work_logs', description: 'Type of log, e.g., work_logs, system_logs' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: string;

  @ApiProperty({ example: 'crm', description: 'Client type or user agent performing the action', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  client_type: string;

  @ApiProperty({ example: 'update', description: 'Type of action performed, e.g., create, update, delete' })
  @Column({ type: DataType.STRING, allowNull: false })
  action_type: string;

  @ApiProperty({ example: '2024-12-11T12:00:00Z', description: 'Timestamp of when the log entry was created' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at: Date;
}
