export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  confirmation_code?: string | null;
  confirmation_code_type?: string | null;
  confirmation_code_expires?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  status?: string;
  cognito_id?: string;
  email_verified?: boolean;
  confirmation_code?: string;
  confirmation_code_type?: string;
  confirmation_code_expires?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  confirmation_code?: string | null;
  confirmation_code_type?: string | null;
  confirmation_code_expires?: Date | null;
  email_verified?: boolean;
  created_at?: Date | null;
  updated_at?: Date | null;
}
