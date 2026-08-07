import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import apiClient from "@/shared/services/api/apiClient";

export function AuthInterceptor() {
  const { accessToken } = useAuth();
  const accessTokenRef = useRef<string | null>(accessToken);

  useLayoutEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    const requestInterceptorId = apiClient.interceptors.request.use((config) => {
      const currentAccessToken = accessTokenRef.current;

      if (currentAccessToken) {
        config.headers.set("Authorization", `Bearer ${currentAccessToken}`);
      } else {
        config.headers.delete("Authorization");
      }

      return config;
    });

    // TODO: implement retry logic for failed requests due to expired access token
    // const responseInterceptorId = apiClient.interceptors.response.use(
    //   (response) => response,
    //   (error: unknown) => Promise.reject(error),
    // );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptorId);
      // apiClient.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return null;
}
