import { UserRole } from '@core/constants/user.constants';

export interface Token {
  refreshToken: string;
  accessToken: string;
}

export interface JwtPayloadEncrypted {
  data: string;
  iat?: number;
  exp?: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
