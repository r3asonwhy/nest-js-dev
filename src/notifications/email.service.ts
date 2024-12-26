import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { renderTemplate } from '@/common/helpers/template.helper';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '@/common/error-constants';
import { TemplateDataMap } from '@/client/interfaces/client.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const isSecure = Number(process.env.SMTP_PORT) === 465;
    const transportOptions: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.GOOGLE_GEN_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async sendEmailWithTemplate<T extends keyof TemplateDataMap>(
    to: string,
    subject: string,
    template: T,
    context: TemplateDataMap[T]
  ): Promise<void> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      throw await I18nHttpException.create('SRV-MAI-2', ERROR_CODES.INVALID_EMAIL);
    }

    try {
      const html = await renderTemplate(template, context);
      console.log(`Sending email to ${to} with subject "${subject}"`);

      await this.transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html });
    } catch (error) {
      console.error('Error sending email:', error);
      throw await I18nHttpException.create('SRV-MAI-3', ERROR_CODES.SEND_FAILED);
    }
  }
}
