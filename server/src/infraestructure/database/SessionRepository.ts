import { prisma } from "./client";
import type { Session } from "@domain/sessions/Session";
import type { SessionRepositoryInterface } from "@domain/sessions/SessionRepositoryInterface";

export class SessionRepository implements SessionRepositoryInterface {
  async create(expiresAt: Date, userId: number): Promise<Session> {
    const saved = await prisma.getClient().session.create({
      data: {
        expiresAt,
        userId,
      },
    });

    return saved;
  }

  async findActiveBySecret(secret: string): Promise<Session | null> {
    const session = await prisma.getClient().session.findUnique({
      where: {
        secret,
        expiresAt: { gte: new Date() },
      },
    });

    return session;
  }

  async inactivateBySecret(secret: string): Promise<void> {
    await prisma.getClient().session.update({
      where: {
        secret,
      },
      data: {
        expiresAt: new Date(),
      },
    });

    return;
  }
}
