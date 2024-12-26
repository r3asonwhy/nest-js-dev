import { BeforeCreate, BeforeSave, Column, DataType, Index, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.interface';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User> implements IUser {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @Column({ type: DataType.STRING, allowNull: false })
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @Column({ type: DataType.STRING, allowNull: false })
  last_name: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Index({name: 'idx_user_full_name' })
  @Column({ type: DataType.STRING, allowNull: true })
  full_name: string;
  
  @ApiProperty({ example: 'user@mailinator.com', description: 'Email address of the user' })
  @Index({name: 'idx_user_email', unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @ApiProperty({ example: 'abc123', description: 'Cognito ID of the user', required: false })
  @Index({name: 'idx_user_cognito_id', unique: true })
  @Column({ type: DataType.STRING, allowNull: true })
  cognito_id?: string | null;

  @ApiProperty({ example: '+380987654333', description: 'Phone number of the user', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  phone: string;

  @ApiProperty({ example: 'Admin', description: 'Role of the user', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  role: string;

  @ApiProperty({ example: 'Pending', description: 'Status of the user', required: false, default: 'Pending' })
  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  status?: string;

  @ApiProperty({ example: true, description: 'Whether the email is verified or not', required: false, default: false })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  email_verified?: boolean;

  @ApiProperty({ example: '123456', description: 'Confirmation code for verification', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  confirmation_code?: string | null;

  @ApiProperty({ example: 'Register', description: 'Type of confirmation code', required: false })
  @Column({ type: DataType.STRING, allowNull: true })
  confirmation_code_type?: string | null;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', description: 'Expiration time of the confirmation code', required: false })
  @Column({ type: DataType.DATE, allowNull: true })
  confirmation_code_expires?: Date | null;

  @ApiProperty({ example: '2024-01-01 12:00:00', description: 'Creation timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01 12:00:00', description: 'Update timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updated_at: Date;

  @BeforeCreate
  @BeforeSave
  static setFullName(instance: User) {
    if (instance.first_name && instance.last_name) {
      instance.full_name = `${instance.first_name} ${instance.last_name}`.trim();
    }
  }
}
