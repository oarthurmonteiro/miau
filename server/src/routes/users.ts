import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { RegisterUserInput, UpdateUserInput } from "./dtos";
import GetUserInfo from "./use-cases/get-user-info";
import CreateUser from "./use-cases/register-user";
import UpdateUser from "./use-cases/update-user";



const app = new Hono();

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number().gt(0) })),
  async (c) => {
    const { id } = c.req.valid("param");

    const user = await GetUserInfo(id);

    return c.json(user);
  },
);

app.post("/", zValidator("json", RegisterUserInput), async (c) => {
  const payload = c.req.valid("json");

  const user = await CreateUser(payload);

  return c.json(user, 201);
});

app.put(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number().gt(0) })),
  zValidator("json", UpdateUserInput),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const user = await UpdateUser(id, payload);

    return c.json(user);
  },
);

export default app;
