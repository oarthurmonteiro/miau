import { Model } from "@domain/Model";
import { Decimal, DecimalToNumber, Id } from "@shared/types";
import { z } from "zod";

export const baseTransactionSchema = z.object({
  id: Id.readonly(),
  amount: Decimal,
  type: z.enum(["income", "expense", "transfer"]),
  accountId: Id.readonly(),
  description: z.string().min(10).max(255),
  date: z.date(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
  deletedAt: z.date().readonly().nullable(),
});

const transactionClassSchema = baseTransactionSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const transactionOutputSchema = baseTransactionSchema
  .extend({
    amount: DecimalToNumber,
  });

export type TransactionOutputData = z.infer<typeof transactionOutputSchema>;
  

export class Transaction extends Model<typeof transactionClassSchema> {
  constructor(data: z.infer<typeof transactionClassSchema>) {
    super(transactionClassSchema, data);
  }
}