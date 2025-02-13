import type { z } from "zod";
import type { RegisterUserSchema } from "./dtos";
import { NonUniqueEmail } from "shared/errors";
import type { UserRepository } from "domain/user/UserRepository";
import { UserRepositoryPrisma } from "infraestructure/prisma/UserRepositoryPrisma";
import { User } from "domain/user/User";

const userRepository: UserRepository = new UserRepositoryPrisma();

export async function registerUser(
  payload: z.infer<typeof RegisterUserSchema>,
) {
  if (false === (await emailIsUnique(payload.email))) {
    throw new NonUniqueEmail();
  }

  const user = new User(payload);
  return await userRepository.create(user);
}

async function emailIsUnique(email: string): Promise<boolean> {
  return (await userRepository.findByEmail(email)) === null;
}
