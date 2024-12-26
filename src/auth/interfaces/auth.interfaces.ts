export interface AuthResponse {
  access_token: string;
}

export interface RefreshTokenResponse {
  newAccessToken: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export interface VerifyCodeInput {
  phone: string;
  code: string;
}

export interface ResendEmailInput {
  email: string;
}

export interface ResendPhoneInput {
  phone: string;
}

export interface CognitoUserInput {
  username: string;
  password: string;
}

export interface TokenPayload {
  user_id: number;
}

export interface CognitoCreateUserResponse {
  userSub: string;
  username: string;
}

export interface CognitoTokenResponse {
  refresh_token: string;
  access_token: string;
  idToken: string;
}
