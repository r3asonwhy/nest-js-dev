import { registerAs } from '@nestjs/config';
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  host: process.env.APP_HOST || 'localhost',
  codeValidityPeriod: parseInt(process.env.CODE_VALIDITY_PERIOD, 10) || 10,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '1h',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  jwtSecret: process.env.JWT_SECRET,
}));
