import { Hono } from "hono";

import { usersRouter } from "routes/v1/users";
import { authRouter } from "./auth";
import { accountsRouter } from "./accounts";
import { transactionsRouter } from "./transactions";

const app = new Hono();

app.route("/users", usersRouter);
app.route("/auth", authRouter);
app.route("/accounts", accountsRouter);
app.route("/transactions", transactionsRouter)

export default app;
