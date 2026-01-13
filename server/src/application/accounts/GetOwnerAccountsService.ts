import { AccountRepository } from "@infraestructure/database/AccountRepository";
import type { z } from "zod";
import { outputAccountSchema } from "./dtos";

export async function getOwnerAccounts(
  ownerId: number,
): Promise<z.infer<typeof outputAccountSchema>[]> {
  const accountRepository = new AccountRepository();

  const accounts = await accountRepository.findManyByOwner(ownerId);

  if (!accounts) {
    return [];
  }

  return accounts.map((account) => outputAccountSchema.parse(account));
}
