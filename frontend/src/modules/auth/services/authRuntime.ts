import axios from "axios";
import type { AuthUser } from "../types/auth";
import { getUserFromAccessToken } from "../utils/getUserFromAccessToken";
import { isAccessTokenUsable } from "../utils/isAccessTokenUsable";
import { broadcastAccessToken, broadcastLogout } from "./authChannel";
import { recoverAccessToken } from "./authSessionService";

type AuthStatus = "uninitialized" | "authenticated" | "anonymous";

interface AuthSnapshot {
  readonly status: AuthStatus;
  readonly accessToken: string | null;
  readonly user: AuthUser | null;
}

let snapshot: AuthSnapshot = {
  status: "uninitialized",
  accessToken: null,
  user: null,
};

const listeners = new Set<() => void>();

let sessionRevision = 0;
let initializationPromise: Promise<void> | null = null;
let recoveryPromise: Promise<string | null> | null = null;

export function getSnapshot(): AuthSnapshot {
  return snapshot;
}

export function getAccessToken(): string | null {
  return snapshot.accessToken;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function publish(nextSnapshot: AuthSnapshot): void {
  snapshot = nextSnapshot;

  listeners.forEach((listener) => listener());
}

export function setSession(accessToken: string): void {
  if (snapshot.status === "authenticated" && snapshot.accessToken === accessToken) return;

  const user = getUserFromAccessToken(accessToken);

  sessionRevision += 1;

  publish({
    status: "authenticated",
    accessToken,
    user,
  });
}

export function clearSession(): void {
  sessionRevision += 1;

  publish({
    status: "anonymous",
    accessToken: null,
    user: null,
  });
}

function getCurrentUsableToken(): string | null {
  const accessToken = getAccessToken();

  return isAccessTokenUsable(accessToken) ? accessToken : null;
}

function recoverSession(rejectedAccessToken: string | null): Promise<string | null> {
  if (recoveryPromise) {
    return recoveryPromise;
  }

  const revisionAtStart = sessionRevision;

  recoveryPromise = recoverAccessToken({
    getCurrentAccessToken: getAccessToken,
    rejectedAccessToken,
  })
    .then((accessToken) => {
      if (sessionRevision !== revisionAtStart) {
        return getCurrentUsableToken();
      }

      setSession(accessToken);
      broadcastAccessToken(accessToken);

      return accessToken;
    })
    .catch((error: unknown) => {
      if (sessionRevision !== revisionAtStart) {
        return getCurrentUsableToken();
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        const hadSession = snapshot.status === "authenticated";

        clearSession();

        if (hadSession) {
          broadcastLogout();
        }

        return null;
      }

      throw error;
    })
    .finally(() => {
      recoveryPromise = null;
    });

  return recoveryPromise;
}

export function initialize(): Promise<void> {
  if (snapshot.status !== "uninitialized") {
    return Promise.resolve();
  }

  if (!initializationPromise) {
    initializationPromise = recoverSession(null)
      .then(() => undefined)
      .finally(() => {
        initializationPromise = null;
      });
  }

  return initializationPromise;
}

export async function ensureAccessToken(): Promise<string | null> {
  await initialize();

  if (snapshot.status === "anonymous") {
    return null;
  }

  const currentAccessToken = getCurrentUsableToken();

  if (currentAccessToken) {
    return currentAccessToken;
  }

  return recoverSession(null);
}

export function renewAccessToken(rejectedAccessToken: string | null): Promise<string | null> {
  if (snapshot.status === "anonymous") {
    return Promise.resolve(null);
  }

  return recoverSession(rejectedAccessToken);
}
