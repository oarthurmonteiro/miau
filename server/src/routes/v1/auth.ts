import { Hono } from "hono";
import { authenticateUser } from "@application/auth/AuthenticateUserService";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@application/auth/dtos";
import { registerUserSchema } from "@application/users/dtos";
import { registerUser } from "@application/users/RegisterUserService";
import { HttpStatusCode } from "@shared/enums";
import { setCookie } from "hono/cookie";

export const authRouter = new Hono();

authRouter.post("/signin", zValidator("json", loginSchema), async (c) => {
  const data = c.req.valid("json");

  const session = await authenticateUser(data);

  setCookie(c, "session", session.secret, {
    path: "/",
    secure: true,
    domain: "localhost",
    httpOnly: true,
    expires: session.expiresAt,
    sameSite: "Strict",
  });

  return c.json({});
});

authRouter.post(
  "/signup",
  zValidator("json", registerUserSchema),
  async (c) => {
    const payload = c.req.valid("json");

    const user = await registerUser(payload);

    const session = await authenticateUser({
      email: payload.email,
      password: payload.password,
    });

    return c.json(user, HttpStatusCode.Created);
  },
);
