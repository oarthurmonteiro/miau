
import { Transaction } from "@domain/transactions/Transaction";
import { prisma } from "./client";
import type { TransactionRepositoryInterface } from "@domain/transactions/TransactionRepositoryInterface";

export class TransactionRepository implements TransactionRepositoryInterface {

  async create(transaction: Transaction): Promise<Transaction> {
    const saved = await prisma.transaction.create({
      data: transaction.data,
    });

    return new Transaction(saved);
  }
}
