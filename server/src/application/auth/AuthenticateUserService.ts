// application/auth/AuthenticateUserService.ts
import { UserRepository } from "@infraestructure/database/UserRepository";
import { generateToken } from "@infraestructure/auth/TokenService";
import { AuthenticationError } from "@shared/errors";
import { successfullLoginOutput, type SuccefullLoginOutput } from "./dtos";

export async function authenticateUser(data: {
  email: string;
  password: string;
}): Promise<SuccefullLoginOutput> {
  const userRepository = new UserRepository();
  const user = await userRepository.findByEmail(data.email);

  if (!user || !(await user.checkPasswordIdentity(data.password))) {
    throw new AuthenticationError();
  }

  const expirationAccessToken = 60 * 15 * 750; // 15 minutes in seconds
  const expirationRefreshToken = 60 * 60 * 24 * 7; // 7 days in seconds

  const accessToken = await generateToken(
    { sub: user.data.id },
    expirationAccessToken,
    "access",
  );

  const refreshToken = await generateToken(
    { sub: user.data.id },
    expirationRefreshToken * 60,
    "refresh",
  );

  return successfullLoginOutput.parse({
    accessToken,
    refreshToken,
    expiresIn: expirationAccessToken,
  });
}
