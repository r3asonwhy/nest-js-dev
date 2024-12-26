import dayjs, { ManipulateType } from 'dayjs';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { Response, Request } from 'express';
import { COOKIE_MAX_AGE } from '../constants';
import { generateDeviceId } from '../utils/extra.util';
import { ERROR_CODES } from '../error-constants';

/**
 * Generates an expiration date based on the parameters passed
 * @param amount Amount of time units (for example, 1 hour or 7 days)
 * @param unit Time type (eg 'hour', 'day', 'minute', 'month')
 * @returns Expiry date
 */
export async function generateExpiryDate(amount: number, unit: ManipulateType = 'hour'): Promise<Date> {
  if (amount <= 0) {
    throw await I18nHttpException.create('HLP-TOK-1', ERROR_CODES.INVALID_AMOUNT, { amount });
  }
  const validUnits: ManipulateType[] = ['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  if (!validUnits.includes(unit)) {
    throw await I18nHttpException.create('HLP-TOK-2', ERROR_CODES.INVALID_UNIT, { unit, validUnits: validUnits.join(', ') });
  }
  return dayjs().add(amount, unit).toDate();
}

export function setCookie(
  res: Response,
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
  } = {},
): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? isProduction,
    maxAge: options.maxAge ?? COOKIE_MAX_AGE,
  });
}

export function clearCookie(res: Response, name: string): void {
  res.cookie(name, '', { maxAge: 0 });
}

export function ensureDeviceId(req: Request, res: Response): string {
  let deviceId = req.cookies['device_id'];
  if (!deviceId) {
    deviceId = generateDeviceId();
    setCookie(res, 'device_id', deviceId);
  }
  return deviceId;
}