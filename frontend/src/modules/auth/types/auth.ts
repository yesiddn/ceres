export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse extends UserResponse {}

export interface UserResponse {
  id: string;
  email: string;
}
