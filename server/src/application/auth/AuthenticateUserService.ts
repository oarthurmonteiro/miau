// application/auth/AuthenticateUserService.ts
import { UserRepository } from "@infraestructure/database/UserRepository";
import { AuthenticationError } from "@shared/errors";
import { SessionRepository } from "@infraestructure/database/SessionRepository";
import { sessionSchema, type Session } from "@domain/sessions/Session";

export async function authenticateUser(
  email: string,
  password: string,
): Promise<Session> {
  const userRepository = new UserRepository();
  const sessionRepository = new SessionRepository();

  const user = await userRepository.findByEmail(email);

  if (!user || !(await Bun.password.verify(password, user.password))) {
    throw new AuthenticationError();
  }

  const sessionExpiresAt = new Date().getTime() + 2 * 60 * 60 * 1000;

  const session = await sessionRepository.create(
    new Date(sessionExpiresAt),
    user.id,
  );
  return sessionSchema.parse(session);
}
