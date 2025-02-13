import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { AuthenticationError, NotFoundError } from "shared/errors";
import { decode, sign, verify } from "hono/jwt";
import UserRepository from "@domains/users/repository";
import { bearerAuth } from "hono/bearer-auth";

const app = new Hono();

const LoginDto = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12),
});

function createTokenPayload<T extends Record<string, unknown>>(
  data: T,
  expirationInSeconds: number
) {
  const now = Math.floor(Date.now() / 1000)
  return {
    ...data,
    iat: now,
    exp: now + expirationInSeconds
  }
}

app.post("/login", zValidator("json", LoginDto), async (c) => {
  const { email, password } = c.req.valid("json");

  const repo = new UserRepository();

  const user = await repo.getByEmail(email);

  if (!user) {
    throw new NotFoundError();
  }

  const isMatch = await Bun.password.verify(password, user.password);

  if (!isMatch) {
    throw new AuthenticationError();
  }

  // TODO: mudar isso

  const pay = createTokenPayload({sub: user.id}, 60 * 5)

  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
  };
  const secret = "super-duper-secret";
  const token = await sign(payload, secret);

  return c.json({ token: token, type: "Bearer" });
});

app.post("/refresh-token", async (c) => {
  const { authorization } = c.req.header();

  if (!authorization && !authorization.startsWith("Bearer ")) {
    throw new AuthenticationError();
  }

  const token = authorization.replace("Bearer ", "");
  const secret = "super-duper-secret";

  try {
    const decodedPayload = await verify(token, secret);

    const newPayload = {
      ...decodedPayload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    };

    return c.json({
      token: await sign(newPayload, secret),
      type: "Bearer ",
    });
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("Invalid Token");
  }
});

export default app;
