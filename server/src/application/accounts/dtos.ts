import { baseAccountSchema } from "@domain/accounts/Account";

export const createAccountSchema = baseAccountSchema.pick({
  name: true,
  initialBalance: true,
});

// export const updateAccountSchema = createAccountSchema.partial();
