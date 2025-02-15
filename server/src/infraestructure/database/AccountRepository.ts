import type { AccountRepositoryInterface } from "@domain/account/AccountRepositoryInterface";
import { Account } from "@domain/account/Account";
import { prisma } from "./client";

export class AccountRepository implements AccountRepositoryInterface {
  async findManyByOwner(ownerId: number): Promise<Account[] | null> {
    const accounts = await prisma.account.findMany({
      where: { ownerId: ownerId },
    });

    console.log(accounts);
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
}
