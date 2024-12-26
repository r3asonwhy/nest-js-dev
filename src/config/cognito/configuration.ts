import { registerAs } from '@nestjs/config';

export default registerAs('cognito', () => ({
  userPoolId: process.env.AWS_COGNITO_POOL_ID || '',
  clientId: process.env.AWS_COGNITO_CLIENT_ID || '',
  region: process.env.AWS_REGION_NAME || '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  jwksUri: process.env.COGNITO_JWKS_URI,
}));
