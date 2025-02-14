import { Hono } from "hono";

import users from "routes/v1/users";

const app = new Hono();

app.route("/users", users);
// app.route("/auth", auth);

export default app;
