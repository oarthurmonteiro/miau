import { Hono } from "hono";
import { authenticateUser } from "@application/auth/AuthenticateUserService";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@application/auth/dtos";
import { registerUserSchema } from "@application/users/dtos";
import { registerUser } from "@application/users/RegisterUserService";
import * as HttpStatusCode from "@shared/enums";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { unathenticateUser } from "@application/auth/UnauthenticateUserService";

export const authRouter = new Hono();

authRouter.delete("/sign-out", async (c) => {

  const session = getCookie(c, 'session');

  if (!session) throw new Error();

  await unathenticateUser(session);

  deleteCookie(c, 'session');

  return c.body(null, HttpStatusCode.NoContent);

});

authRouter.post("/sign-in", zValidator("json", loginSchema), async (c) => {
  const data = c.req.valid("json");

  const session = await authenticateUser(data);

  setCookie(c, "session", session.secret, {
    path: "/",
    secure: true,
    httpOnly: true,
    expires: session.expiresAt,
    sameSite: "Strict",
  });

  return c.body(null, HttpStatusCode.NoContent);
});

authRouter.post(
  "/sign-up",
  zValidator("json", registerUserSchema),
  async (c) => {
    const payload = c.req.valid("json");

    await registerUser(payload);

    const session = await authenticateUser({
      email: payload.email,
      password: payload.password,
    });

    setCookie(c, "session", session.secret, {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      expires: session.expiresAt,
      sameSite: "Strict",
    });

    return c.json({}, HttpStatusCode.Created);
  },
);
