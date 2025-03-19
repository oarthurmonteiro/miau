// application/auth/AuthenticateUserService.ts
import { UserRepository } from "@infraestructure/database/UserRepository";
import { generateToken } from "@infraestructure/auth/TokenService";
import { AuthenticationError } from "@shared/errors";
import { successfullLoginOutput, type SuccefullLoginOutput } from "./dtos";
import { SessionRepository } from "@infraestructure/database/SessionRepository";
import {
  type SessionOutputType,
  baseSessionSchema,
  Session,
} from "@domain/sessions/Session";

export async function authenticateUser(userAuth: {
  email: string;
  password: string;
}): Promise<SessionOutputType> {
  const userRepository = new UserRepository();
  const user = await userRepository.findByEmail(userAuth.email);

  if (!user || !(await user.checkPasswordIdentity(userAuth.password))) {
    throw new AuthenticationError();
  }

  const sessionExpiresAt = new Date().getTime() + 2 * 60 * 60 * 1000;
  const sessionRepository = new SessionRepository();
  const session = new Session({
    userId: user.data.id as number,
    expiresAt: new Date(sessionExpiresAt),
  });

  return baseSessionSchema.parse(
    (await sessionRepository.create(session)).data,
  );
}
