import type { z } from "zod";
import type { registerUserSchema } from "./dtos";
import { NonUniqueEmail } from "shared/errors";
import type { UserRepository } from "@domain/users/UserRepository";
import { UserRepositoryPrisma } from "@infraestructure/prisma/UserRepositoryPrisma";
import {
  User,
  userOutputSchema,
  type UserOutputData,
} from "@domain/users/User";
import { UserValidators } from "@domain/users/UserValidators";

const userRepository: UserRepository = new UserRepositoryPrisma();

export async function registerUser(
  payload: z.infer<typeof registerUserSchema>,
): Promise<UserOutputData> {
  const validators = new UserValidators(userRepository);

  if (!(await validators.emailIsUnique(payload.email))) {
    throw new NonUniqueEmail();
  }

  const user = new User(payload);

  return userOutputSchema.parse((await userRepository.create(user)).data);
}
