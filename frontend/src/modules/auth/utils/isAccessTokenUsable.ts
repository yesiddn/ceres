import type { AuthTokenPayload } from "../types/auth";
import { decodeJwtPayload } from "./decodeJwtPayload";

const TOKEN_EXPIRY_MARGIN_SECONDS = 30;

export function isAccessTokenUsable(accessToken: string | null | undefined): accessToken is string {
  if (!accessToken) {
    return false;
  }

  try {
    const payload = decodeJwtPayload<AuthTokenPayload>(accessToken);

    const expiresAt = payload.exp * 1000;

    const minimuumExpiration = Date.now() + TOKEN_EXPIRY_MARGIN_SECONDS * 1000;

    return expiresAt > minimuumExpiration;
  } catch {
    return false;
  }
}
