import { baseAccountSchema } from "@domain/account/Account";

export const createAccountSchema = baseAccountSchema.pick({
  name: true,
  initialBalance: true,
});

// export const updateAccountSchema = createAccountSchema.partial();
