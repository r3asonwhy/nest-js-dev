import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '1h',
}));
