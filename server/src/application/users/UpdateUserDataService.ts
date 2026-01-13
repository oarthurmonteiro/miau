import type { z } from "zod";
import { outputUserSchema, type updateUserSchema } from "./dtos";
import { NonUniqueEmail, NotFoundError } from "@shared/errors";
import type { UserWithoutPassword } from "@domain/users/User";
import { UserValidators } from "@domain/users/UserValidators";
import { UserRepository } from "@infraestructure/database/UserRepository";

const userRepository = new UserRepository();

export async function updateUserData(
  id: number,
  payload: z.infer<typeof updateUserSchema>,
): Promise<UserWithoutPassword> {
  const validators = new UserValidators(userRepository);
  let user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  if (
    payload.email &&
    user.email !== payload.email &&
    !(await validators.emailIsUnique(payload.email))
  ) {
    throw new NonUniqueEmail();
  }

  user = await userRepository.update(user);

  return outputUserSchema.parse(user);
}
