import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { registerUserSchema, updateUserSchema } from "@application/users/dtos";
import { registerUser } from "@application/users/RegisterUserService";
import { getUserData } from "@application/users/GetUserDataService";
import { updateUserData } from "@application/users/UpdateUserDataService";
import { Id } from "@shared/types";
import { HttpStatusCode } from "@shared/enums";

export const usersRouter = new Hono();

usersRouter.get(
  "/:id",
  zValidator("param", z.object({ id: Id })),
  async (c) => {
    const { id } = c.req.valid("param");

    const user = await getUserData(id);

    return c.json(user);
  },
);

// usersRouter.post("/", zValidator("json", registerUserSchema), async (c) => {
//   const payload = c.req.valid("json");

//   const user = await registerUser(payload);

//   return c.json(user, HttpStatusCode.Created);
// });

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
