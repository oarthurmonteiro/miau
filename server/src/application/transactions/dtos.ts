import { transactionSchema } from "@domain/transactions/Transaction";

export const createTransactionSchema = transactionSchema.pick({
  amount: true,
  accountId: true,
  description: true,
  date: true,
});
