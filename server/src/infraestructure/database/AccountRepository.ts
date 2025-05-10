import type { AccountRepositoryInterface } from "@domain/accounts/AccountRepositoryInterface";
import { Account } from "@domain/accounts/Account";
import { prisma } from "./client";

export class AccountRepository implements AccountRepositoryInterface {

  async findByIdAndOwner(id: number, ownerId: number): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: { id, ownerId }
    });

    if (!account) return null;
    return new Account(account);
  }

  async findManyByOwner(ownerId: number): Promise<Account[] | null> {
    const accounts = await prisma.account.findMany({
      where: { ownerId: ownerId },
    });

    if (0 === accounts.length) {
      return null;
    }

    return accounts.map((account) => new Account(account));
  }

  async create(account: Account): Promise<Account> {
    const saved = await prisma.account.create({
      data: account.data,
    });

    return new Account(saved);
  }

  async update(account: Account): Promise<Account> {
    const saved = await prisma.account.update({
      data: account.data,
      where: { id: account.data.id }
    });

    return new Account(saved);
  }
}
