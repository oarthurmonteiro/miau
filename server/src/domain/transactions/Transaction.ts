import { Decimal, DecimalToNumber, Id } from "@shared/types";
import { z } from "zod";

export const transactionSchema = z.object({
  id: Id.readonly(),
  amount: Decimal,
  type: z.enum(["income", "expense", "transfer"]),
  accountId: Id.readonly(),
  description: z.string().min(3).max(255),
  date: z.coerce.date(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
  deletedAt: z.date().readonly().nullable(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// const transactionClassSchema = baseTransactionSchema.partial({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
//   deletedAt: true,
// });

// export const transactionOutputSchema = baseTransactionSchema.extend({
//   amount: DecimalToNumber,
// });

// export type TransactionOutputData = z.infer<typeof transactionOutputSchema>;
