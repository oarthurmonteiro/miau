import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as HttpStatusCode from "@shared/enums";
import { authnMiddleware } from "@shared/middlewares/authnMiddleware";
import { createAccountSchema } from "@application/accounts/dtos";
import { getUserId } from "@infraestructure/hono/env";
import { createAccount } from "@application/accounts/CreateAccountService";
import { getOwnerAccounts } from "@application/accounts/GetOwnerAccountsService";

export const accountsRouter = new Hono();

accountsRouter.use(authnMiddleware());

accountsRouter.post("/", zValidator("json", createAccountSchema), async (c) => {
  const payload = c.req.valid("json");
  const ownerId = getUserId();

  const account = await createAccount(ownerId, payload);

  return c.json(account, HttpStatusCode.Created);
});

accountsRouter.get("/", async (c) => {
  const ownerId = getUserId();

  const accounts = await getOwnerAccounts(ownerId);

  return c.json(accounts);
});
