import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { NotificationPayload } from './interfaces/notification.interface';
import { TemplateDataMap } from '@/client/interfaces/client.interface';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async sendNotification<T extends Record<string, any>>(
    payload: NotificationPayload & { template?: keyof TemplateDataMap; context?: T },
  ): Promise<void> {
    if (payload.type === 'email') {
      if (!payload.template || !payload.context) {
        throw new Error('Template and context are required for email notifications');
      }

      const subject = payload.context.subject;
      if (!subject) {
        throw new Error('Subject is required for email notifications');
      }

      await this.emailService.sendEmailWithTemplate(
        payload.to,
        subject,
        payload.template,
        payload.context
      );
    } else if (payload.type === 'sms') {
      if (!payload.message) {
        throw new Error('Message is required for SMS notifications');
      }

      await this.smsService.sendSms(payload.to, payload.message);
    } else {
      throw new Error('Invalid notification type');
    }
  }
}
