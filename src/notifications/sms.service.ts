import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly API_URL = process.env.TURBOSMS_API_URL;
  private readonly TOKEN = process.env.TURBOSMS_API_TOKEN;

  async sendSms(phone: string, message: string): Promise<void> {
    try {
      const payload = {
        recipients: [phone],
        sms: {
          sender: process.env.TURBOSMS_SENDER,
          text: message,
        },
      };

      const headers = { 
        Authorization: `Bearer ${this.TOKEN}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(this.API_URL, payload, { headers });

      if (response.status !== 200) {
        throw new HttpException(
          `SMS sending failed: ${response.data.message || 'Unknown error'}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log(`SMS sent to ${phone}`);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new HttpException('Failed to send SMS', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
