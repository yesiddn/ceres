import apiClient from "@/shared/services/api/apiClient";
import type { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, renewAccessToken } from "./authRuntime";
import axios from "axios";

const REFRESH_EXCLUDED_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

function isRefreshExcluded(url?: string) {
  const path = url?.split("?")[0];

  return REFRESH_EXCLUDED_ENDPOINTS.some((endpoint) => path?.endsWith(endpoint));
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let installed = false;

export function installAuthInterceptors(): void {
  if (installed) return;

  installed = true;

  apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error;
      }

      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (!originalRequest || isRefreshExcluded(originalRequest.url) || originalRequest._retry) {
        throw error;
      }

      if (originalRequest.signal?.aborted) {
        throw error;
      }

      originalRequest._retry = true;

      const authorization = originalRequest.headers.get("Authorization");

      const rejectedAccessToken =
        typeof authorization === "string" && authorization.startsWith("Bearer ")
          ? authorization.slice("Bearer ".length)
          : null;

      const newAccessToken = await renewAccessToken(rejectedAccessToken);

      if (originalRequest.signal?.aborted) {
        throw error;
      }

      if (!newAccessToken) {
        window.location.replace("/login");
        throw error;
      }

      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

      return apiClient(originalRequest);
    },
  );
}
