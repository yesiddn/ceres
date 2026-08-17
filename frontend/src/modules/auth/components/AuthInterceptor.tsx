import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import apiClient from "@/shared/services/api/apiClient";
import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { recoverAccessToken } from "../services/authSessionService";
import { broadcastLogout } from "../services/authChannel";

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

export function AuthInterceptor() {
  const { accessToken, login, logout } = useAuth();
  const accessTokenRef = useRef<string | null>(accessToken);

  useLayoutEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    let refreshPromise: Promise<string> | null = null;

    const getFreshAccessToken = (rejectedAccessToken: string | null) => {
      if (!refreshPromise) {
        refreshPromise = recoverAccessToken({
          getCurrentAccessToken: () => accessTokenRef.current,
          rejectedAccessToken,
        })
          .then((accessToken) => {
            accessTokenRef.current = accessToken;

            login(accessToken);

            return accessToken;
          })
          .catch((error: unknown) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              accessTokenRef.current = null;

              logout();
              broadcastLogout();

              window.location.replace("/login");
            }

            throw error;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise;
    };

    const requestInterceptorId = apiClient.interceptors.request.use((config) => {
      const currentAccessToken = accessTokenRef.current;

      if (currentAccessToken) {
        config.headers.set("Authorization", `Bearer ${currentAccessToken}`);
      } else {
        config.headers.delete("Authorization");
      }

      return config;
    });

    const responseInterceptorId = apiClient.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (isRefreshExcluded(originalRequest.url)) {
          return Promise.reject(error);
        }

        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const authorizationHeader = originalRequest.headers.get("Authorization");
          const rejectedAccessToken =
            typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ")
              ? authorizationHeader.slice("Bearer ".length)
              : null;

          const newAccessToken = await getFreshAccessToken(rejectedAccessToken);

          originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);

          return apiClient(originalRequest);
        } catch (refreshError: unknown) {
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptorId);
      apiClient.interceptors.response.eject(responseInterceptorId);
    };
  }, [logout, login]);

  return null;
}
