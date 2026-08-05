import type { AuthTokenPayload, AuthUser } from "../types/auth";
import { decodeJwtPayload } from "./decodeJwtPayload";

export function getUserFromAccessToken(accessToken: string): AuthUser {
  const payload = decodeJwtPayload<AuthTokenPayload>(accessToken);

  return {
    id: payload.UserId,
    email: payload.email,
  };
}
