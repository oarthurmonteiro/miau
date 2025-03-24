import { prisma } from "./client";
import { Session } from "@domain/sessions/Session";
import type { SessionRepositoryInterface } from "@domain/sessions/SessionRepositoryInterface";

export class SessionRepository implements SessionRepositoryInterface {
  async create(session: Session): Promise<Session> {
    const saved = await prisma.session.create({
      data: session.data,
    });

    return new Session(saved);
  }

  async findActiveBySecret(secret: string): Promise<Session | null> {
    const session = await prisma.session.findUnique({
      where: {
        secret,
        expiresAt: { gte: new Date() },
      },
    });

    if (!session) return null;
    return new Session(session);
  }

  async inactivateBySecret(secret: string): Promise<void> {
    await prisma.session.update({
      where: {
        secret
      },
      data: {
        expiresAt: new Date(),
      }
    });

    return;
  }

  // async update(user: User): Promise<User> {
  //   const saved = await prisma.user.update({
  //     where: { id: user.data.id },
  //     data: user.data,
  //   });

  //   return new User(saved);
  // }
}
