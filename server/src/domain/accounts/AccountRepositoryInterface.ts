import type { Account } from "./Account";

export interface AccountRepositoryInterface {
  findByIdAndOwner(id: number, ownerId: number): Promise<Account | null>;
  findManyByOwner(ownerId: number): Promise<Account[] | null>;
  create(
    account: Omit<Account, "id" | "createdAt" | "updatedAt">,
  ): Promise<Account>;
  update(
    accountId: number,
    account: Partial<Omit<Account, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Account>;
}
