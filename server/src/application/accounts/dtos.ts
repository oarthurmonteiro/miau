import { accountSchema } from "@domain/accounts/Account";
import { DecimalToNumber } from "@shared/types";

export const createAccountSchema = accountSchema.pick({
  name: true,
  initialBalance: true,
});

export const updateAccountSchema = createAccountSchema.partial();

export const outputAccountSchema = accountSchema
  .omit({ ownerId: true })
  // .extend({
  //   initialBalance: DecimalToNumber,
  //   currentBalance: DecimalToNumber,
  // });
