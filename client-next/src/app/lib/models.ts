export type Account = {
    id: number,
    name: string,
    initialBalance: number,
    currentBalance: number,
    type: string,
}

export type Transaction = {
    id: number,
    amount: number,
    type: 'income' | 'expense' | 'transfer',
    accountId: number,
    description: string,
    date: string,
}
