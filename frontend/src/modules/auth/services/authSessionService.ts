import { refresh as refreshRequest } from "./authService";
import { broadcastAccessToken, requestAccessTokenFromTabs } from "./authChannel";
import { isAccessTokenUsable } from "../utils/isAccessTokenUsable";

const AUTH_REFRESH_LOCK = "ceres-auth-refresh";

interface RecoverAccessTokenOptions {
  getCurrentAccessToken: () => string | null;
  rejectedAccessToken: string | null;
}

function isCandidateToken(
  accessToken: string | null,
  rejectedAccessToken?: string | null,
): accessToken is string {
  return accessToken !== rejectedAccessToken && isAccessTokenUsable(accessToken);
}

export async function recoverAccessToken({
  getCurrentAccessToken,
  rejectedAccessToken,
}: RecoverAccessTokenOptions): Promise<string> {
  const currentAccessToken = getCurrentAccessToken();

  if (isCandidateToken(currentAccessToken, rejectedAccessToken)) {
    return currentAccessToken;
  }

  const sharedAccessToken = await requestAccessTokenFromTabs();

  if (isCandidateToken(sharedAccessToken, rejectedAccessToken)) {
    return sharedAccessToken;
  }

  return navigator.locks.request(AUTH_REFRESH_LOCK, async () => {
    const currentAfterLock = getCurrentAccessToken();

    if (isCandidateToken(currentAfterLock, rejectedAccessToken)) {
      return currentAfterLock;
    }

    const sharedAfterLock = await requestAccessTokenFromTabs(50);

    if (isCandidateToken(sharedAfterLock, rejectedAccessToken)) {
      return sharedAfterLock;
    }

    const response = await refreshRequest();

    broadcastAccessToken(response.accessToken);

    return response.accessToken;
  });
}
