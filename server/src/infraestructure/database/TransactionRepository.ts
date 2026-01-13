import type { Transaction } from "@domain/transactions/Transaction";
import { prisma } from "./client";
import type { TransactionRepositoryInterface } from "@domain/transactions/TransactionRepositoryInterface";

export class TransactionRepository implements TransactionRepositoryInterface {
  async create(
    transaction: Omit<
      Transaction,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
  ): Promise<Transaction> {
    const saved = await prisma.getClient().transaction.create({
      data: transaction,
    });

    return saved;
  }
}
