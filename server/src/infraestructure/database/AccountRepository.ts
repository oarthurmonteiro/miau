import type { AccountRepositoryInterface } from "@domain/accounts/AccountRepositoryInterface";
import type { Account } from "@domain/accounts/Account";
import { prisma } from "./client";

export class AccountRepository implements AccountRepositoryInterface {
  async findByIdAndOwner(id: number, ownerId: number): Promise<Account | null> {
    const account = await prisma.getClient().account.findUnique({
      where: { id, ownerId },
    });

    return account;
  }

  async findManyByOwner(ownerId: number): Promise<Account[] | null> {
    const accounts = await prisma.getClient().account.findMany({
      where: { ownerId: ownerId },
    });

    if (0 === accounts.length) {
      return null;
    }

    return accounts;
  }

  async create(
    account: Omit<Account, "id" | "createdAt" | "updatedAt">,
  ): Promise<Account> {
    const saved = await prisma.getClient().account.create({
      data: account,
    });

    return saved;
  }

  async update(
    accountId: number,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Account> {

    const saved = await prisma.getClient().account.update({
      data: account,
      where: { id: accountId },
    });

    return saved;
  }
}
