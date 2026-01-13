import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { updateUserSchema } from "@application/users/dtos";
import { getUserData } from "@application/users/GetUserDataService";
import { updateUserData } from "@application/users/UpdateUserDataService";
import { Id } from "@shared/types";
import * as HttpStatusCode from "@shared/enums";
import { authnMiddleware } from "@shared/middlewares/authnMiddleware";
import { getUserId } from "@infraestructure/hono/env";

export const usersRouter = new Hono();

usersRouter.use(authnMiddleware());

usersRouter.get("/", async (c) => {
  const userId = getUserId();

  const user = await getUserData(userId);

  return c.json(user);
});

usersRouter.put(
  "/:id",
  zValidator("param", z.object({ id: Id })),
  zValidator("json", updateUserSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const user = await updateUserData(id, payload);

    return c.json(user);
  },
);
