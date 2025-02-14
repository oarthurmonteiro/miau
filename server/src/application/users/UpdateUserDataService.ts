import type { z } from "zod";
import type { updateUserSchema } from "./dtos";
import { NonUniqueEmail, NotFoundError } from "@shared/errors";
import { userOutputSchema, type UserOutputData } from "@domain/users/User";
import { UserValidators } from "@domain/users/UserValidators";
import { UserRepositoryPrisma } from "@infraestructure/prisma/UserRepositoryPrisma";

const userRepository = new UserRepositoryPrisma();

export async function updateUserData(
  id: number,
  payload: z.infer<typeof updateUserSchema>,
): Promise<UserOutputData> {
  const validators = new UserValidators(userRepository);
  let user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  if (
    payload.email &&
    user.data.email !== payload.email &&
    !(await validators.emailIsUnique(payload.email))
  ) {
    throw new NonUniqueEmail();
  }

  if (payload.password) {
    await user.encryptPassword(payload.password);
  }

  user.data = {
    ...user.data,
    ...payload,
  };

  user = await userRepository.update(user);

  return userOutputSchema.parse(user.data);
}
