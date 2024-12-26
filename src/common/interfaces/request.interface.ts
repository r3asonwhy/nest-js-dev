import { User } from '@/models/users/entities/user.entity';
import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user?: User;
  lang?: string;
}