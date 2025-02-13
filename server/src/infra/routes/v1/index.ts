import { Hono } from "hono";

import users from "@domains/users/routes";
import auth from "@domains/auth/routes";

const app = new Hono();

app.route("/users", users);
app.route("/auth", auth);

export default app;
    