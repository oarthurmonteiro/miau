import { SessionRepository } from "@infraestructure/database/SessionRepository";
import { AuthenticationError } from "@shared/errors";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export function authnMiddleware() {
  return createMiddleware(async (c, next) => {
    try {
      const sessionSecret = getCookie(c, "session");

      if (!sessionSecret) {
        throw new Error();
      }

      const sessionRepository = new SessionRepository();
      const session = await sessionRepository.findActiveBySecret(sessionSecret);

      if (!session) {
        throw new Error();
      }

      c.set("userId", session.data.userId);

      await next();
    } catch (err) {
      console.error(err);
      throw new AuthenticationError();
    }
  });
}
