export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  username: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface UserInfo {
  username: string;
  displayName: string;
  roles: string[];
  avatar?: string;
}
