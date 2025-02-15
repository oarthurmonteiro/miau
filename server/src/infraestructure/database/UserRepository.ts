import { prisma } from "./client";
import { User } from "@domain/users/User";
import type { UserRepositoryInterface } from "@domain/users/UserRepositoryInterface";

export class UserRepository implements UserRepositoryInterface {
  async findById(id: number): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { id: id } });
    if (!userData) return null;

    return new User(userData);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return null;

    return new User(userData);
  }

  async create(user: User): Promise<User> {
    const saved = await prisma.user.create({
      data: {
        ...user.data,
        password: await user.encryptPassword(),
      },
    });
    return new User(saved);
  }

  async update(user: User): Promise<User> {
    const saved = await prisma.user.update({
      where: { id: user.data.id },
      data: user.data,
    });

    return new User(saved);
  }
}
