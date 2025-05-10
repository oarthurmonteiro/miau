import { accountOutputSchema, type Account, type AccountOutputData } from "@domain/accounts/Account";
import { AccountRepository } from "@infraestructure/database/AccountRepository";
import { AuthorizationError } from "@shared/errors";

export async function getOwnerAccount(
  accountId: number,
  ownerId: number,
): Promise<AccountOutputData> {
  const accountRepository = new AccountRepository();

  const account = await accountRepository.findByIdAndOwner(accountId, ownerId);
  
  if (!account) throw new AuthorizationError();

  return accountOutputSchema.parse(account.data)
}
