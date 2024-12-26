import { TemplateDataMap } from "@/client/interfaces/client.interface";

export interface NotificationPayload {
  to: string;
  type: 'email' | 'sms';
  message?: string;
  template?: keyof TemplateDataMap;
  context?: Record<string, any>;
}
