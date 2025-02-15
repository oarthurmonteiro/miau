2f1d6e7d062c0acb264d68b2a61bd1224f414cd5

# [Tables](https://dbdiagram.io/d/MiAu-67994e69263d6cf9a056aa8e)

![MiAu Database.svg](MiAu%20Database.svg)

## Users

Stores the app users

| Column       | Type        | Constraints       | Description                                  |
| ------------ | ----------- | ----------------- | -------------------------------------------- |
| `id`         | int         | PK auto increment | Unique identifier for the user.              |
| `first_name` | varchar(16) | not null          | User's first name.                           |
| `last_name`  | varchar(64) | not null          | User's last name.                            |
| `email`      | varchar(16) | unique not null   | User's email address (must be unique).       |
| `password`   | text        | not null          | User's password (store securely using hash). |
| `created_at` | timestamp   |                   | Date and time of user creation.              |
| `updated_at` | timestamp   |                   | Date and time of last user update.           |

## Accounts

Stores the users accounts to consider their balances

| Column            | Type                     | Constraints            | Description                                                                  |
| ----------------- | ------------------------ | ---------------------- | ---------------------------------------------------------------------------- |
| `id`              | int                      | PK auto increment      | Unique identifier for the account.                                           |
| `user_id`         | int                      | FK `users.id` not null | ID of the user who owns the account (references users.id).                   |
| `name`            | varchar(255)             | not null               | Account name (e.g., "Checking Account", "Savings", "Wallet").                |
| `initial_balance` | decimal(10, 2)           | not null               | Initial account balance.                                                     |
| `current_balance` | decimal(10, 2)           | not null               | Current account balance.                                                     |
| `type`            | enum(`owner`, `virtual`) | not null               | Account type ('user' for user accounts, 'virtual' for credit card accounts). |
| `created_at`      | timestamp                |                        | Date and time of account creation.                                           |
| `updated_at`      | timestamp                |                        | Date and time of last account update.                                        |

## Balance History

Store users account balance daily history

| Column       | Type           | Constraints       | Description                                       |
| ------------ | -------------- | ----------------- | ------------------------------------------------- |
| `id`         | int            | PK auto increment | Unique identifier for the balance history record. |
| `account_id` | int            | not null          | ID of the account (references accounts.id).       |
| `balance`    | decimal(10, 2) | not null          | Account balance at that moment.                   |
| `date`       | date           | not null          | Date when the balance was recorded.               |
| `created_at` | timestamp      | not null          | Date and time of record creation.                 |

## Credit Cards

Store users credit cards

| Column       | Type           | Constraints            | Description                                                    |
| ------------ | -------------- | ---------------------- | -------------------------------------------------------------- |
| `id`         | int            | PK auto increment      | Unique identifier for the credit card.                         |
| `owner_id`   | int            | FK `users.id` not null | ID of the user who owns the credit card (references users.id). |
| `name`       | varchar(255)   | not null               | Credit card name (e.g., "Visa", "Mastercard").                 |
| `limit`      | decimal(10, 2) | not null               | Credit card limit.                                             |
| `due_day`    | int            | not null               | Day of the month when the invoice is due (e.g., 10, 25).       |
| `created_at` | timestamp      |                        | Date and time of credit card creation.                         |
| `updated_at` | timestamp      |                        | Date and time of last credit card update.                      |
| `deleted_at` | timestamp      |                        |                                                                |

## Categories

Store the transactions categories, can be global for all users (column `user_id` is null) or specif for the user (column `user_id` equal `users.id`)

| Column       | Type         | Constraints       | Description                                                    |
| ------------ | ------------ | ----------------- | -------------------------------------------------------------- |
| `id`         | int          | PK auto increment | Unique identifier for the category.                            |
| `user_id`    | int          | FK `users.id`     | ID of the user who created the category (references users.id). |
| `name`       | varchar(255) | not null          | Category name (e.g., "Food", "Transportation", "Leisure").     |
| `created_at` | timestamp    |                   | Date and time of category creation.                            |
| `updated_at` | timestamp    |                   | Date and time of last category update.                         |
| `deleted_at` | timestamp    |                   |                                                                |

## Invoices

Store the credit card invoices

| Column              | Type                                             | Constraints          | Description                                                   |
| ------------------- | ------------------------------------------------ | -------------------- | ------------------------------------------------------------- |
| `id`                | int                                              | PK auto increment    | Unique identifier for the invoice.                            |
| `credit_card_id`    | int                                              | FK `credit_cards.id` | ID of the invoice's credit card (references credit_cards.id). |
| `start_date`        | date                                             | not null             | Start date of the invoice period.                             |
| `end_date`          | date                                             | not null             | End date of the invoice period.                               |
| `total_amount`      | decimal(10, 2)                                   | not null             | Total invoice amount.                                         |
| `amount_paid`       | decimal(10, 2)                                   | default 0.00         | Amount paid on the invoice.                                   |
| `remaining_balance` | decimal(10, 2)                                   | not null             | Remaining balance of the invoice                              |
| `status`            | enum(`open`, `closed`, `partially_paid`, `paid`) | default `open`       | Invoice status.                                               |
| `created_at`        | timestamp                                        |                      | Date and time of invoice creation.                            |
| `updated_at`        | timestamp                                        |                      | Date and time of last invoice update.                         |
| `deleted_at`        | timestamp                                        |                      |                                                               |

## Transactions

Store all users transactions, can be incomes, expenses, transfers or credit_cards expenses

| Column        | Type                                  | Constraints        | Description                                               |
| ------------- | ------------------------------------- | ------------------ | --------------------------------------------------------- |
| `id`          | int                                   | PK auto increment  | Unique identifier for the transaction.                    |
| `account_id`  | int                                   | FK `accounts.id`   | ID of the transaction account (references accounts.id).   |
| `category_id` | int                                   | FK `categories.id` | ID of the transaction category (references categories.id) |
| `amount`      | decimal(10, 2)                        | not null           | Transaction amount.                                       |
| `type`        | enum(`income`, `expense`, `transfer`) | not null           | Transaction type.                                         |
| `date`        | date                                  | not null           | Transaction date.                                         |
| `description` | varchar(255)                          |                    | Transaction description (optional).                       |
| `created_at`  | timestamp                             |                    | Date and time of transaction creation.                    |
| `updated_at`  | timestamp                             |                    | Date and time of last transaction update.                 |
| `deleted_at`  | timestamp                             |                    |                                                           |

## Transfers

Store users transfers from some account to another.

| Column                       | Type      | Constraints                   | Description                                                     |
| ---------------------------- | --------- | ----------------------------- | --------------------------------------------------------------- |
| `id`                         | int       | PK auto increment             | Unique identifier for the transfer                              |
| `source_transaction_id`      | int       | FK `transactions.id` not null | ID of the source transaction (references transactions.id).      |
| `destination_transaction_id` | int       | FK `transactions.id` not null | ID of the destination transaction (references transactions.id). |
| `created_at`                 | timestamp |                               | Date and time of transfer creation.                             |
| `updated_at`                 | timestamp |                               | Date and time of last transfer update.                          |
| `deleted_at`                 | timestamp |                               |                                                                 |

## Credit Card Transactions

Store the credit card transactions

| Column               | Type      | Constraints                   | Description                                                                 |
| -------------------- | --------- | ----------------------------- | --------------------------------------------------------------------------- |
| `id`                 | int       | PK auto increment             | Unique identifier for the transaction.                                      |
| `transaction_id`     | int       | FK `transactions.id` not null | ID of the transaction (references transactions.id).                         |
| `credit_card_id`     | int       | FK `credit_cards.id` not null | ID of the transaction's credit card (references credit_cards.id).           |
| `invoice_id`         | int       | FK `invoices.id`              | ID of the invoice the transaction was included in (references invoices.id). |
| `installment_number` | int       |                               | Installment number (if applicable).                                         |
| `total_installments` | int       |                               | Total installments (if applicable).                                         |
| `created_at`         | timestamp |                               | Date and time of transfer creation.                                         |
| `updated_at`         | timestamp |                               | Date and time of last transfer update.                                      |
| `deleted_at`         | timestamp |                               |                                                                             |
