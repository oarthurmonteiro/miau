import { Decimal, DecimalToNumber, Id } from "@shared/types";
import { z } from "zod";

export const baseAccountSchema = z.object({
  id: Id.readonly(),
  name: z.string().min(2).max(16),
  initialBalance: Decimal,
  currentBalance: Decimal,
  type: z.enum(["owner", "virtual"]),
  ownerId: Id.readonly(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

const accountClassSchema = baseAccountSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const accountOutputSchema = baseAccountSchema
  .omit({
    ownerId: true,
  })
  .extend({
    initialBalance: DecimalToNumber,
    currentBalance: DecimalToNumber,
  });

export type AccountOutputData = z.infer<typeof accountOutputSchema>;

export class Account {
  #data;

  constructor(data: z.infer<typeof accountClassSchema>) {
    this.#data = accountClassSchema.parse(data);
  }

  public get data() {
    return this.#data;
  }

  public set data(newData: z.infer<typeof accountClassSchema>) {
    this.#data = accountClassSchema.parse({
      ...this.#data,
      newData,
    });
  }
}
