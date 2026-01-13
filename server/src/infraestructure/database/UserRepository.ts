import { prisma } from "./client";
import { encryptPassword, type User } from "@domain/users/User";
import type { UserRepositoryInterface } from "@domain/users/UserRepositoryInterface";

export class UserRepository implements UserRepositoryInterface {
  async findById(id: number): Promise<User | null> {
    return await prisma.getClient().user.findUnique({ where: { id: id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.getClient().user.findUnique({ where: { email } });
  }

  async create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    console.dir({
      originalPwd: user.password,
      newPwd: await encryptPassword(user.password),
    });

    const saved = await prisma.getClient().user.create({
      data: {
        ...user,
        password: await encryptPassword(user.password),
      },
    });
    return saved;
  }

  async update(
    userId: number,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<User> {
    const saved = await prisma.getClient().user.update({
      where: { id: userId },
      data: {
        ...user,
        password:
          typeof user.password === "string"
            ? await encryptPassword(user.password)
            : undefined,
      },
    });

    return saved;
  }
}
