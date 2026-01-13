import { Decimal, DecimalToNumber, Id } from "@shared/types";
import { z } from "zod";

export const accountSchema = z.object({
  id: Id.readonly(),
  name: z.string().min(2).max(16),
  initialBalance: Decimal,
  currentBalance: Decimal,
  type: z.enum(["owner", "virtual"]),
  ownerId: Id.readonly(),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

export type Account = z.infer<typeof accountSchema>;

// const accountClassSchema = baseAccountSchema.partial({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

// export const accountOutputSchema = baseAccountSchema
//   .omit({
//     ownerId: true,
//   })
//   .extend({
//     initialBalance: DecimalToNumber,
//     currentBalance: DecimalToNumber,
//   });

// export type AccountOutputData = z.infer<typeof accountOutputSchema>;
