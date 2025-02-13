import type { z } from "zod";
import { NonUniqueEmail, NotFoundError } from "shared/errors";
import { UserOutput, type UpdateUserInput } from "../dtos";
import UserRepository from "../repository";

const repo = new UserRepository();

export default async function UpdateUser(
  id: number,
  payload: z.infer<typeof UpdateUserInput>,
): Promise<z.infer<typeof UserOutput>> {
  let user = await repo.getById(id);

  if (!user) {
    throw new NotFoundError();
  }

  if (
    payload.email &&
    user.email !== payload.email &&
    false === (await checkUniqueEmail(payload.email))
  ) {
    throw new NonUniqueEmail();
  }

  user = await repo.update(id, payload);

  return UserOutput.parse(user);
}

async function checkUniqueEmail(email: string): Promise<boolean> {
  return (await repo.getByEmail(email)) === null;
}
