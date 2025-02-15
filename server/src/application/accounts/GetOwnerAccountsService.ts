import {
  accountOutputSchema,
  type AccountOutputData,
} from "@domain/account/Account";
import { AccountRepository } from "@infraestructure/database/AccountRepository";

export async function getOwnerAccounts(
  ownerId: number,
): Promise<AccountOutputData[]> {
  const accountRepository = new AccountRepository();

  const accounts = await accountRepository.findManyByOwner(ownerId);

  if (!accounts) {
    return [];
  }

  return accounts.map((account) => accountOutputSchema.parse(account.data));
}
