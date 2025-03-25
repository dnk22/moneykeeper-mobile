# Account APIs Documentation

## Table of Contents

1. [Update Account (requestUpdateAccount)](#update-account)
2. [Delete Account (requestDeleteAccount)](#delete-account)

---

## Update Account {#update-account}

Updates an existing account's information and recalculates related balances.

### Flow Steps Overview

1. Update account information (queryUpdateAccount)
2. Update balance if initial amount changed (queryUpdateBalanceAfterUpdateAccount)
3. Recalculate all balances after date (queryCalculateAllBalanceAfterDate)

### Detailed Process Flow

#### 1. queryUpdateAccount

- Input: account ID and updated account data
- Process:
  1. Find account by ID in database
  2. Compare old and new initialAmount/creditCardLimit
  3. Update account with new data
  4. Return isUpdateBalance flag if amounts changed
- Response: `{ isUpdateBalance: boolean, data: TAccount }`

#### 2. queryUpdateBalanceAfterUpdateAccount

- Triggered if: initialAmount or creditCardLimit changed
- Process:
  1. Find balance record with null transactionDate
  2. Update balance record with new initialAmount
  3. Set both openAmount and closingAmount to new initialAmount

#### 3. queryCalculateAllBalanceAfterDate

- Process:
  1. Get latest balance before specified date
  2. Fetch all balance records after that date
  3. Recalculate balances sequentially:
     - First record: uses previous closingAmount
     - Subsequent records: use previous record's closingAmount
     - For each record: closingAmount = openAmount + movementAmount
  4. Batch update all recalculated balances

---

## Delete Account {#delete-account}

Deletes an account and recalculates balances for related accounts.

### Flow Steps Overview

1. Delete account by ID (queryDeleteAccountById)
2. Delete related transactions (queryDeleteAllTransactionRelatedWithAccountId)
3. Recalculate affected account balances (queryCalculateAllBalanceAfterDate)

### Detailed Process Flow

#### 1. queryDeleteAccountById

- Input: accountId (string)
- Process:
  1. Find account by ID
  2. Mark account as deleted in database
  3. Return success/error response

#### 2. queryDeleteAllTransactionRelatedWithAccountId

- Input: accountId (string)
- Process:
  1. Delete all transactions linked to account
  2. Return list of affected accounts that need balance recalculation
- Response: Array of `{ accountId: string, dateTimeAt: number }`

#### 3. Balance Recalculation Process

- For each affected account:
  1. Filter out deleted account from recalculation list
  2. Calculate new balances from affected date
  3. Update all subsequent balance records

### Request

- Method: `DELETE`
- Endpoint: `/api/accounts/:id`
- Authentication: Required

### Response

```json
{
  "success": true
}
```

### Error Responses

- 401: Unauthorized
- 404: Account not found
- 500: Database error during deletion/recalculation
