import { baseTransactionSchema } from "@domain/transactions/Transaction";

export const createTransactionSchema = baseTransactionSchema.pick({
  amount: true,
  accountId: true,
  description: true,
  date: true,
});
