import type { z } from "zod";

import { NotFoundError } from "shared/errors";
import { UserOutput } from "../dtos";
import UserRepository from "../repository";

const repo = new UserRepository();

export default async function GetUserInfo(
  id: number,
): Promise<z.infer<typeof UserOutput>> {
  const user = await repo.getById(id);

  if (!user) {
    throw new NotFoundError();
  }

  return UserOutput.parse(user);
}
