import { HttpStatus } from "@nestjs/common";

export enum UserRole {
  STAFF = 'Staff',
  ADMIN = 'Admin'
}

export enum UserStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active'
}

export enum CodeType {
  REGISTER = 'Register',
  RESET_PASSWORD = 'Reset password'
}

export const BCRYPT_ROUNDS = 10;

export const LANGUAGES = ['en', 'uk'];

export const COOKIE_MAX_AGE = 2592000000;

export enum LogActionType {
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete'
}

export enum LogType {
  WORK_LOGS = 'work_logs',
  ERROR_LOGS = 'error_logs'
}

export enum LogModel {
  USER = 'user',
  MEDIA_FILE = 'media_file'
}

export const STATIC_PAGES = ['login', 'register'];

export const STATIC_TEMPLATE_MAP: Record<string, string> = {
  login: 'login',
  register: 'register',
};

export const CustomHttpStatus = {
  ...HttpStatus,
  TOKEN_EXPIRED: 498,
};

export const LAYOUT_PATH = 'client/layout.hbs';
