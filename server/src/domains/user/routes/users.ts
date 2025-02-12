import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { CreateUserInput, UpdateUserInput, UserOutput } from "../dtos/User";
import { NotFoundError } from "shared/errors";

import CreateUser from "../use-cases/CreateUser";
import UpdateUser from "../use-cases/UpdateUser";
import UserRepository from "../repositories/User";

const app = new Hono();

app.get("/", async (c) => {
  // const allUsers = await Bun.file("./storage/users.json").json();
  // return c.json(allUsers);

  const repo = new UserRepository();

  const allUsers = await repo.getAll();

  return c.json(allUsers.map((user) => UserOutput.parse(user)));
});

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number().gt(0) })),
  async (c) => {
    const { id } = c.req.valid("param");

    const allUsers = await Bun.file("./storage/users.json").json();

    const user = allUsers.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundError();
    }

    return c.json(user);
  },
);

app.post("/", zValidator("json", CreateUserInput), async (c) => {
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

    return c.json(user, 200);
  },
);

export default app;
