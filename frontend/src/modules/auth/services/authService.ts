import apiClient from "@/shared/services/api/apiClient";
import type { LoginRequest, AuthResponse, RegisterRequest, RegisterResponse } from "../types/auth";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", credentials);

  return response.data;
}

export async function register(credentials: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>("/auth/register", credentials);

  return response.data;
}

export async function refresh(): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/refresh");

  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
