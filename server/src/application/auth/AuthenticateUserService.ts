// // application/auth/AuthenticateUserService.ts
// import type { UserRepository } from "@domain/users/UserRepository";
// import { UserRepositoryPrisma } from "@infraestructure/prisma/UserRepositoryPrisma";
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "@infraestructure/auth/TokenService";
// import { AuthenticationError } from "@shared/errors";

// export async function authenticateUser(data: {
//   email: string;
//   password: string;
// }): Promise<{ token: string } | { error: string }> {
//   const userRepository: UserRepository = new UserRepositoryPrisma();
//   const user = await userRepository.findByEmail(data.email);

//   if (!user || !user.checkPasswordIdentity(data.password)) {
//     throw new AuthenticationError();
//   }

//   const expirationInSeconds = 60 * 15;
//   const accessTokenToken = await generateAccessToken(
//     { userId: user.data.id },
//     expirationInSeconds,
//   );
//   const refreshToken = await generateRefreshToken(
//     { userId: user.data.id },
//     expirationInSeconds * 60,
//   );
//   return { token };
// }
