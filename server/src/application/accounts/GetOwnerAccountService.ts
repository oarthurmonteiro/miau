import { AccountRepository } from "@infraestructure/database/AccountRepository";
import { AuthorizationError } from "@shared/errors";
import { outputAccountSchema } from "./dtos";
import type { z } from "zod";

export async function getOwnerAccount(
  accountId: number,
  ownerId: number,
): Promise<z.infer<typeof outputAccountSchema>> {
  const accountRepository = new AccountRepository();

  const account = await accountRepository.findByIdAndOwner(accountId, ownerId);

  if (!account) throw new AuthorizationError();

  return outputAccountSchema.parse(account);
}
