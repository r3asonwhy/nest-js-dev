import { LogActionType, LogType } from '@/common/constants';

export interface ILog {
  user_id: number;
  model: string;
  model_id: number;
  action: string;
  type: string;
  client_type: string;
  action_type: string;
  created_at: Date;
}

export interface CreateLogParams<T> {
  user_id: number | null;
  model: keyof typeof fieldMappings;
  model_id: number;
  action?: Array<{ action: string; from: string | number | null; to: string | number | null }> | null;
  type: LogType;
  action_type: LogActionType;
  client_type: string | null;
  oldData?: Partial<T> | null;
  newData?: Partial<T> | null;
}

export const fieldMappings = {
  user: {
    status: {
      1: 'Очікується',
      2: 'Активний',
      3: 'Заблокований',
    },
    role: {
      1: 'Адмін',
      2: 'Користувач',
    },
  },
  order: {
    status: {
      1: 'Очікується',
      2: 'Обробляється',
      3: 'Завершено',
      4: 'Скасовано',
    },
  },
  media_file: {}
};