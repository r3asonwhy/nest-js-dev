export interface IToken {
  user_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}

export interface TokenData {
  user_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  device_id?: string;
}

export interface UpdateTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: Date;
}
