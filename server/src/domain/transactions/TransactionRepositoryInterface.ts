import type { Transaction } from "./Transaction";

export interface TransactionRepositoryInterface {

  create(transaction: Transaction): Promise<Transaction>;

}
