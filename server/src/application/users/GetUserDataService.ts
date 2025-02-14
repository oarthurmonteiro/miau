import { NotFoundError } from "@shared/errors";
import { UserRepositoryPrisma } from "@infraestructure/prisma/UserRepositoryPrisma";
import { userOutputSchema, type UserOutputData } from "@domain/users/User";

export async function getUserData(id: number): Promise<UserOutputData> {
  const userRepository = new UserRepositoryPrisma();

  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError();
  }

  return userOutputSchema.parse(user.data);
}
