import { replace, type MiddlewareFunction } from "react-router";
import * as authRuntime from "../services/authRuntime";

export const initializeAuthMiddleware: MiddlewareFunction = async ({ request }, next) => {
  request.signal.throwIfAborted();

  await authRuntime.initialize();

  request.signal.throwIfAborted();

  await next();
};

export const requireAuthMiddleware: MiddlewareFunction = async ({ request }, next) => {
  request.signal.throwIfAborted();

  const accessToken = await authRuntime.ensureAccessToken();

  request.signal.throwIfAborted();

  if (!accessToken) {
    throw replace("/login");
  }

  await next();
};
