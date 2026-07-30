import apiClient from "@/shared/services/api/apiClient";
import type { LoginRequest, LoginResponse } from "../types/auth";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials);

  return response.data;
}
