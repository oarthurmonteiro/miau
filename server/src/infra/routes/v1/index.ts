import { Hono } from "hono";

import users from "@domains/user/routes/users";

const app = new Hono();

app.route("/users", users);

export default app;
