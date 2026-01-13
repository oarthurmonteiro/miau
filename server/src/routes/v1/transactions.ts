import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import * as HttpStatusCode from "@shared/enums";
import { authnMiddleware } from "@shared/middlewares/authnMiddleware";
import { getUserId } from "@infraestructure/hono/env";
import { getOwnerAccount } from "@application/accounts/GetOwnerAccountService";
import { createExpense } from "@application/transactions/CreateExpenseService";
import { createTransactionSchema } from "@application/transactions/dtos";

export const transactionsRouter = new Hono();

transactionsRouter.use(authnMiddleware());

transactionsRouter.post(
  "/",
  zValidator("json", createTransactionSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const ownerId = getUserId();

    const account = await getOwnerAccount(payload.accountId, ownerId);

    const expense = await createExpense(payload, { ...account, ownerId });

    return c.json(expense, HttpStatusCode.Created);
  },
);
