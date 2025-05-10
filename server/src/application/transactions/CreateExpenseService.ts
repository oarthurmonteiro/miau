import type { z } from "zod";
import type { createTransactionSchema } from "./dtos";
import { Transaction, transactionOutputSchema, type TransactionOutputData } from "@domain/transactions/Transaction";
import { TransactionRepository } from "@infraestructure/database/TransactionRepository";
import type { Account } from "@domain/accounts/Account";
import { AccountRepository } from "@infraestructure/database/AccountRepository";

export async function createExpense(
  payload: z.infer<typeof createTransactionSchema>,
  account: Account,
): Promise<TransactionOutputData> {

  const transactionRepository = new TransactionRepository();
  const accountRepository = new AccountRepository();

  const transaction = new Transaction({
    ...payload,
    type: 'expense',
  });

  const createdTransaction = await transactionRepository.create(transaction);

  account.data.currentBalance.sub(createdTransaction.data.amount);
  await accountRepository.update(account);

  return transactionOutputSchema.parse(createdTransaction.data);
}
