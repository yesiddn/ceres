/**
 * Decodes the payload of a JWT token without verifying its signature.
 *
 * @template T - The shape of the decoded payload.
 * @param token - A well-formed JWT string with three dot-separated parts.
 * @returns The decoded payload parsed as `T`.
 * @throws {Error} If the token does not have exactly three parts, or if the
 * payload is not valid base64url-encoded JSON.
 */
export function decodeJwtPayload<T>(token: string): T {
  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    throw new Error("Invalid JWT token format");
  }

  const payload = tokenParts[1];

  const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");

  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");

  const decodedPayload = atob(paddedPayload);

  return JSON.parse(decodedPayload) as T;
}
