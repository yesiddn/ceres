export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse extends AuthUser {}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthTokenPayload {
  UserId: string;
  email: string;
  exp: number;
}
