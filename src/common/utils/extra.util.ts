import { AppConfigSingleton } from './config.singleton';
import { v4 as uuidv4 } from 'uuid';
import { I18nService } from 'nestjs-i18n';

export async function generateOneTimeCode(): Promise<{ code: string; expires_at: Date }> {
  const appConfigService = await AppConfigSingleton.getInstance();
  const validityPeriod = appConfigService.codeValidityPeriod;

  // Generation of a 4-digit numeric code
  const min = 1000;
  const max = 9999;
  const code = Math.floor(Math.random() * (max - min + 1) + min).toString();

  const expires_at = new Date();
  expires_at.setMinutes(expires_at.getMinutes() + validityPeriod);
  
  return { code, expires_at };
}

export function generateDeviceId(): string {
  return uuidv4();
}

export function getI18nService(app: any): I18nService<Record<string, unknown>> {
  return app.get(I18nService);
}

export function getFileExtension(buffer: Buffer): string {
  const fileSignature = buffer.toString('hex', 0, 8);
  const fileExtensions: { [signature: string]: string } = {
    '89504e470d0a1a0a': 'png',
    ffd8ffe000104a464946: 'jpg',
    ffd8ffe1a67c4578: 'jpg',
    ffd8ffe1: 'jpg',
  };
  return fileExtensions[fileSignature] || 'jpg';
}
