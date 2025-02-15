import type { z } from "zod";
import type { registerUserSchema } from "./dtos";
import { NonUniqueEmail } from "shared/errors";
import { UserRepository } from "@infraestructure/database/UserRepository";
import {
  User,
  userOutputSchema,
  type UserOutputData,
} from "@domain/users/User";
import { UserValidators } from "@domain/users/UserValidators";

export async function registerUser(
  payload: z.infer<typeof registerUserSchema>,
): Promise<UserOutputData> {
  const userRepository = new UserRepository();

  const validators = new UserValidators(userRepository);

  if (!(await validators.emailIsUnique(payload.email))) {
    throw new NonUniqueEmail();
  }

  const user = new User(payload);
  const createdUser = await userRepository.create(user);
  return userOutputSchema.parse(createdUser.data);
}
