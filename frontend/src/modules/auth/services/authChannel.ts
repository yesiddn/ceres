type AuthChannelMessage =
  | {
      type: "REQUEST_ACCESS_TOKEN";
      requestId: string;
    }
  | {
      type: "ACCESS_TOKEN_RESPONSE";
      requestId: string;
      accessToken: string;
    }
  | {
      type: "ACCESS_TOKEN_UPDATED";
      accessToken: string;
    }
  | {
      type: "LOGOUT";
    };

const authChannel = new BroadcastChannel("ceres-auth");

export function broadcastAccessToken(accessToken: string) {
  authChannel.postMessage({
    type: "ACCESS_TOKEN_UPDATED",
    accessToken,
  } satisfies AuthChannelMessage);
}

export function broadcastLogout() {
  authChannel.postMessage({
    type: "LOGOUT",
  } satisfies AuthChannelMessage);
}

export function requestAccessTokenFromTabs(timeoutMs = 100): Promise<string | null> {
  const requestId = crypto.randomUUID();

  return new Promise((resolve) => {
    let timeoutId: number;

    const handler = (event: MessageEvent<AuthChannelMessage>) => {
      const message = event.data;

      if (message.type !== "ACCESS_TOKEN_RESPONSE" || message.requestId !== requestId) {
        return;
      }

      window.clearTimeout(timeoutId);
      authChannel.removeEventListener("message", handler);

      resolve(message.accessToken);
    };

    authChannel.addEventListener("message", handler);

    authChannel.postMessage({
      type: "REQUEST_ACCESS_TOKEN",
      requestId,
    } satisfies AuthChannelMessage);

    timeoutId = window.setTimeout(() => {
      authChannel.removeEventListener("message", handler);

      resolve(null);
    }, timeoutMs);
  });
}

export function respondWithAccessToken(requestId: string, accessToken: string) {
  authChannel.postMessage({
    type: "ACCESS_TOKEN_RESPONSE",
    requestId,
    accessToken,
  } satisfies AuthChannelMessage);
}

export function subscribeToAuthChannel(listener: (message: AuthChannelMessage) => void) {
  const handler = (event: MessageEvent<AuthChannelMessage>) => {
    listener(event.data);
  };

  authChannel.addEventListener("message", handler);

  return () => {
    authChannel.removeEventListener("message", handler);
  };
}
