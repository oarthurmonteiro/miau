import { NotFoundError } from "@shared/errors";
import { UserRepository } from "@infraestructure/database/UserRepository";
import { userOutputSchema, type UserOutputData } from "@domain/users/User";

export async function getUserData(id: number): Promise<UserOutputData> {
  const userRepository = new UserRepository();

  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  return userOutputSchema.parse(user.data);
}
