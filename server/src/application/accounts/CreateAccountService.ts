import type { z } from "zod";
import { outputAccountSchema, type createAccountSchema } from "./dtos";
import { AccountRepository } from "@infraestructure/database/AccountRepository";
import type { Account } from "@domain/accounts/Account";

export async function createAccount(
  ownerId: number,
  payload: z.infer<typeof createAccountSchema>,
): Promise<z.infer<typeof outputAccountSchema>> {
  const accountRepository = new AccountRepository();

  const account: Omit<Account, "id" | "createdAt" | "updatedAt"> = {
    ...payload,
    currentBalance: payload.initialBalance,
    ownerId,
    type: "owner",
  };

  const createdAccount = await accountRepository.create(account);
  return outputAccountSchema.parse(createdAccount);
}
