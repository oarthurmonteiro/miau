import { verifyToken } from "@infraestructure/auth/TokenService";
import { InvalidTokenError } from "@shared/errors";
import { createMiddleware } from "hono/factory";

export function authnMiddleware() {
  return createMiddleware(async (c, next) => {
    try {
      const { authorization } = c.req.header();

      // if there is not a header authorization
      // and the header is not a bearer token
      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new Error();
      }

      const token = authorization.replace("Bearer ", "");

      // console.log(
      //   await sign({
      //     sub: 1,
      //     iat: Math.floor(Date.now() / 1000),
      //     exp: Math.floor(Date.now() / 1000) + 60 * 5 * 10, // Token expires in 5 minutes
      //   }, process.env.SECRET_ACCESS_TOKEN),
      // );
      const { sub } = await verifyToken(token, "access");
      if (!sub) {
        throw new Error();
      }

      c.set("userId", sub);

      await next();
    } catch (err) {
      console.error(err);
      throw new InvalidTokenError();
    }
  });
}
