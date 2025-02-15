import { Hono } from "hono";

import { usersRouter } from "routes/v1/users";
import { authRouter } from "./auth";
import { accountsRouter } from "./accounts";

const app = new Hono();

app.route("/users", usersRouter);
app.route("/auth", authRouter);
app.route("/accounts", accountsRouter);

export default app;
