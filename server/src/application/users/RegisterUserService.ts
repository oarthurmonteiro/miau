import type { z } from "zod";
import { outputUserSchema, type registerUserSchema } from "./dtos";
import { NonUniqueEmail } from "shared/errors";
import { UserRepository } from "@infraestructure/database/UserRepository";
import { UserValidators } from "@domain/users/UserValidators";
import type { UserWithoutPassword } from "@domain/users/User";

export async function registerUser(
  payload: z.infer<typeof registerUserSchema>,
): Promise<UserWithoutPassword> {
  const userRepository = new UserRepository();

  const validators = new UserValidators(userRepository);

  if (!(await validators.emailIsUnique(payload.email))) {
    throw new NonUniqueEmail();
  }

  const createdUser = await userRepository.create(payload);
  return outputUserSchema.parse(createdUser);
}
