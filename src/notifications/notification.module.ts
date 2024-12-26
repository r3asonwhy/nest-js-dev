import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [EmailService, SmsService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
