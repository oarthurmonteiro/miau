import { Hono } from "hono";
import { authenticateUser } from "@application/auth/AuthenticateUserService";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@application/auth/dtos";

export const authRouter = new Hono();

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const data = c.req.valid("json");

  const result = await authenticateUser(data);

  return c.json(result);
});
