import type { Account } from "./Account";

export interface AccountRepositoryInterface {
  // findById(id: number): Promise<Account | null>;
  findByIdAndOwner(id: number, ownerId: number): Promise<Account | null>;
  findManyByOwner(ownerId: number): Promise<Account[] | null>;
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  // update(account: Account): Promise<Account>;
}
