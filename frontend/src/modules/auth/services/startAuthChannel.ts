import { isAccessTokenUsable } from "../utils/isAccessTokenUsable";
import { respondWithAccessToken, subscribeToAuthChannel } from "./authChannel";
import { clearSession, getAccessToken, setSession } from "./authRuntime";

let started = false;

export function startAuthChannel(): void {
  if (started) return;

  started = true;

  subscribeToAuthChannel((message) => {
    if (message.type === "REQUEST_ACCESS_TOKEN") {
      const accessToken = getAccessToken();

      if (isAccessTokenUsable(accessToken)) {
        respondWithAccessToken(message.requestId, accessToken);
      }

      return;
    }

    if (message.type === "ACCESS_TOKEN_UPDATED") {
      if (isAccessTokenUsable(message.accessToken)) {
        setSession(message.accessToken);
      }

      return;
    }

    if (message.type === "LOGOUT") {
      clearSession();
    }
  });
}
