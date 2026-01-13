import { NotFoundError } from "@shared/errors";
import { UserRepository } from "@infraestructure/database/UserRepository";
import type { UserWithoutPassword } from "@domain/users/User";
import { outputUserSchema } from "./dtos";

export async function getUserData(id: number): Promise<UserWithoutPassword> {
  const userRepository = new UserRepository();

  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  return outputUserSchema.parse(user);
}
