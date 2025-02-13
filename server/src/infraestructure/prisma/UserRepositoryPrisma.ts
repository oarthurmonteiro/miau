// infrastructure/prisma/UserRepositoryPrisma.ts
import { prisma } from "./client";
import { User } from "../../domain/user/User";
import type { UserRepository } from "../../domain/user/UserRepository";
import { password } from "bun";

export class UserRepositoryPrisma implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return null;

    return new User(userData);
  }

  async create(user: User): Promise<User> {
    const saved = await prisma.user.create({
      data: {
        ...user.data,
        password: user.password, // acesso privado
      },
    });
    return new User(saved);
  }
}
