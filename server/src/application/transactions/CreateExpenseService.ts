import type { z } from "zod";
import type { createTransactionSchema } from "./dtos";

import { TransactionRepository } from "@infraestructure/database/TransactionRepository";
import type { Account } from "@domain/accounts/Account";
import { AccountRepository } from "@infraestructure/database/AccountRepository";
import type { Transaction } from "@domain/transactions/Transaction";
import { prisma } from "@infraestructure/database/client";

export async function createExpense(
  payload: z.infer<typeof createTransactionSchema>,
  account: Account,
): Promise<Transaction> {
  const transactionRepository = new TransactionRepository();
  const accountRepository = new AccountRepository();

  const transaction: Omit<
    Transaction,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
  > = {
    ...payload,
    type: "expense",
  };

  const [createdTransaction] = await prisma.tx([
    () => transactionRepository.create(transaction),
    () => accountRepository.update(account.id, {
      ...account,
      currentBalance: account.currentBalance.sub(transaction.amount),
    }),
  ]);

  return createdTransaction;
}
