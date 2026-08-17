import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";
import { isAccessTokenUsable } from "../utils/isAccessTokenUsable";
import { respondWithAccessToken, subscribeToAuthChannel } from "../services/authChannel";
import { recoverAccessToken } from "../services/authSessionService";

interface AuthSessionCoordinatorProps {
  children: ReactNode;
}

export function AuthSessionCoordinator({ children }: AuthSessionCoordinatorProps) {
  const { accessToken, login, logout } = useAuth();

  const accessTokenRef = useRef<string | null>(accessToken);
  const initializationPromiseRef = useRef<Promise<string> | null>(null);

  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  useEffect(() => {
    let active = true;

    if (!initializationPromiseRef.current) {
      initializationPromiseRef.current = recoverAccessToken({
        getCurrentAccessToken: () => accessTokenRef.current,
        rejectedAccessToken: null,
      });
    }

    const initialization = initializationPromiseRef.current;

    initialization
      .then((recoveredAccessToken) => {
        if (!active) return;

        accessTokenRef.current = recoveredAccessToken;

        login(recoveredAccessToken);
      })
      .catch(() => {
        if (!active) return;

        if (isAccessTokenUsable(accessTokenRef.current)) {
          return;
        }

        accessTokenRef.current = null;

        logout();
      })
      .finally(() => {
        if (active) setIsReady(true);
      });

    return () => {
      active = false;
    };
  }, [login, logout]);

  useEffect(() => {
    return subscribeToAuthChannel((message) => {
      if (message.type === "REQUEST_ACCESS_TOKEN") {
        const currentAccessToken = accessTokenRef.current;

        if (isAccessTokenUsable(currentAccessToken)) {
          respondWithAccessToken(message.requestId, currentAccessToken);
        }

        return;
      }

      if (message.type === "ACCESS_TOKEN_UPDATED") {
        if (!isAccessTokenUsable(message.accessToken)) {
          return;
        }

        accessTokenRef.current = message.accessToken;

        login(message.accessToken);

        return;
      }

      if (message.type === "LOGOUT") {
        accessTokenRef.current = null;

        logout();
      }
    });
  }, [login, logout]);

  if (!isReady) {
    return null;
  }

  return children;
}
