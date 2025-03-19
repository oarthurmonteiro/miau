import type { z } from "zod";
import type { createAccountSchema } from "./dtos";
import {
  Account,
  accountOutputSchema,
  type AccountOutputData,
} from "@domain/accounts/Account";
import { AccountRepository } from "@infraestructure/database/AccountRepository";

export async function createAccount(
  ownerId: number,
  payload: z.infer<typeof createAccountSchema>,
): Promise<AccountOutputData> {
  const accountRepository = new AccountRepository();

  const account = new Account({
    ...payload,
    currentBalance: payload.initialBalance,
    ownerId,
    type: "owner",
  });

  const createdAccount = await accountRepository.create(account);
  return accountOutputSchema.parse(createdAccount.data);
}
