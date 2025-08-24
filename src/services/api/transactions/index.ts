import { TRANSACTIONS } from 'database/constants';
import { SyncQueueAction } from 'database/models/syncQueue.model';
import { transactionLocalQuery, balanceLocalQuery, syncQueueLocalQuery } from 'database/querying';
import { TTransactions } from 'database/types';
import { transactionsFb } from 'services/firebase/db/transactions';
import { formatDataBeforeSubmit } from './helpers';

/**
 * Updates or creates a transaction record and updates related balances.
 *
 * @input
 * - data: TTransactions - The transaction data including amount, category, account etc.
 *
 * @output
 * - No explicit return value - Throws error on failure
 *
 * @flow
 * 1. Format the input data
 * 2. If no ID in data:
 *    a. Create new transaction in local database
 *    b. Sync to Firebase (or queue for sync if fails)
 *    c. Add new balance record for the affected account
 * 3. If ID exists:
 *    a. Update existing transaction
 *    b. Sync updated transaction to Firebase (or queue for sync if fails)
 *    c. Update balances for affected accounts
 *    d. Recalculate balances for any accounts no longer associated with transaction
 */
export const updateTransaction = async ({ data }: { data: TTransactions }) => {
  const requestData = formatDataBeforeSubmit(data) as TTransactions;

  try {
    // If no ID is provided, create a new transaction
    if (!requestData?.id) {
      const transactionCreated = await transactionLocalQuery.addNewTransaction(requestData);
      // // Sync to firebase
      await transactionsFb
        .addNewTransaction({ transaction: transactionCreated._raw })
        .catch(async (error) => {
          await syncQueueLocalQuery.updateSyncQueueItem({
            recordId: transactionCreated.id,
            payload: transactionCreated._raw,
            tableName: TRANSACTIONS,
            action: SyncQueueAction.CREATE,
          });
        });
      // Update the balance and calculate new balances after the transaction
      await balanceLocalQuery.addNewBalance({
        transactionId: transactionCreated.id,
        accountId: transactionCreated.accountId,
        movementAmount: transactionCreated.amount,
        dateRecord: transactionCreated.recordAt,
      });
    } else {
      const { id, ...dataWithoutId } = requestData;
      await transactionLocalQuery
        .updateTransaction({ id, data: dataWithoutId })
        .then(async ({ isUpdateBalance, prevTransaction, transactionUpdated }: any) => {
          // sync to firebase
          await transactionsFb
            .updateTransaction({ transaction: transactionUpdated._raw })
            .catch(async (error) => {
              await syncQueueLocalQuery.updateSyncQueueItem({
                recordId: transactionUpdated.id,
                payload: transactionUpdated._raw,
                tableName: TRANSACTIONS,
                action: SyncQueueAction.UPDATE,
              });
            });
          // danh sách các tài khoản cần cập nhật số dư loại trừ tài khoản hiện tại
          const listAccountNeedUpdateBalance = [
            ...new Set(
              [prevTransaction.accountId, prevTransaction.toAccountId].filter(
                (item) => item && item !== transactionUpdated.toAccountId,
              ),
            ),
          ];
          // Update balance
          if (isUpdateBalance) {
            // update balance với thông tin từ transactionUpdated
            await balanceLocalQuery.updateBalance({
              transactionId: transactionUpdated.id,
              accountId: prevTransaction.accountId,
              newAccountId: transactionUpdated.accountId,
              movementAmount: transactionUpdated.amount,
              dateRecord: transactionUpdated.recordAt,
            });

            // nếu list account cần update nhiều hơn 1 account thì sẽ tính toán lại số dư
            if (listAccountNeedUpdateBalance.length) {
              for await (const item of listAccountNeedUpdateBalance) {
                await balanceLocalQuery.calculateBalanceAccountByDate({
                  accountId: item,
                  date: prevTransaction.recordAt,
                });
              }
            }
          }
        });
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Updates or creates a transfer transaction between two accounts and updates balances for both.
 *
 * @input
 * - data: TTransactions - The transaction data including amount, fromAccount, toAccount, etc.
 *
 * @output
 * - Promise<void> on success
 * - Promise.reject({success: false, error}) on failure
 *
 * @flow
 * 1. Format the input data and ensure toAmount is positive
 * 2. If no ID in data (new transaction):
 *    a. Create new transfer transaction in local database
 *    b. Sync to Firebase (or queue for sync if fails)
 *    c. Add new balance records for both source and destination accounts
 * 3. If ID exists (update):
 *    a. Update existing transaction
 *    b. Sync updated transaction to Firebase (or queue for sync if fails)
 *    c. Update balances for the current accounts involved
 *    d. Recalculate balances for any previously involved accounts no longer part of the transaction
 */
export const updateTransactionTransfer = async ({ data }: { data: TTransactions }) => {
  // gán amount là giá trị âm (chi), toAmount là giá trị dương (thu)
  const dataFormatted = formatDataBeforeSubmit(data) as TTransactions;

  const requestData = {
    ...dataFormatted,
    toAmount: Math.abs(+dataFormatted.amount),
  } as TTransactions;

  try {
    // Create a new transaction
    if (!requestData.id) {
      const transactionCreated = await transactionLocalQuery.addNewTransaction(requestData);
      // // Sync to firebase
      await transactionsFb
        .addNewTransaction({ transaction: transactionCreated._raw })
        .catch(async (error) => {
          await syncQueueLocalQuery.updateSyncQueueItem({
            recordId: transactionCreated.id,
            payload: transactionCreated._raw,
            tableName: TRANSACTIONS,
            action: SyncQueueAction.CREATE,
          });
        });

      // update balance
      const requestDataBalance = {
        [requestData.accountId]: {
          transactionId: transactionCreated.id,
          accountId: transactionCreated.accountId,
          movementAmount: transactionCreated.amount,
          dateRecord: transactionCreated.recordAt,
        },
        [requestData.toAccountId]: {
          transactionId: transactionCreated.id,
          accountId: transactionCreated.toAccountId,
          movementAmount: transactionCreated.toAmount,
          dateRecord: transactionCreated.recordAt,
        },
      };

      // Update balances and calculate new balances for accounts involved in the transaction
      for await (const item of [requestData.accountId, requestData.toAccountId]) {
        await balanceLocalQuery.addNewBalance({
          ...requestDataBalance[item],
        });
      }
    } else {
      const { id, ...dataWithoutId } = requestData;
      await transactionLocalQuery
        .updateTransaction({ id, data: dataWithoutId })
        .then(async ({ isUpdateBalance, prevTransaction, transactionUpdated }: any) => {
          // sync to firebase
          await transactionsFb
            .updateTransaction({ transaction: transactionUpdated._raw })
            .catch(async (error) => {
              await syncQueueLocalQuery.updateSyncQueueItem({
                recordId: transactionUpdated.id,
                payload: transactionUpdated._raw,
                tableName: TRANSACTIONS,
                action: SyncQueueAction.UPDATE,
              });
            });

          const listCurrentAccount = [transactionUpdated.accountId, transactionUpdated.toAccountId];

          // danh sách các tài khoản cần cập nhật số dư loại trừ danh sách tài khoản hiện tại
          const listAccountNeedUpdateBalance = [
            ...new Set(
              [prevTransaction.accountId, prevTransaction.toAccountId].filter(
                (item) => item && !listCurrentAccount.includes(item),
              ),
            ),
          ];

          const requestDataBalance = {
            [transactionUpdated.accountId]: {
              transactionId: transactionUpdated.id,
              accountId: prevTransaction.accountId,
              newAccountId: transactionUpdated.accountId,
              movementAmount: transactionUpdated.amount,
              dateRecord: transactionUpdated.recordAt,
            },
            [transactionUpdated.toAccountId]: {
              transactionId: transactionUpdated.id,
              accountId: prevTransaction.toAccountId,
              newAccountId: transactionUpdated.toAccountId,
              movementAmount: transactionUpdated.toAmount,
              dateRecord: transactionUpdated.recordAt,
            },
          };
          if (isUpdateBalance) {
            for await (const item of listCurrentAccount) {
              await balanceLocalQuery.updateBalance({ ...requestDataBalance[item] });
            }
            // nếu list account cần update nhiều hơn 1 account thì sẽ tính toán lại số dư
            if (listAccountNeedUpdateBalance.length) {
              for await (const item of listAccountNeedUpdateBalance) {
                await balanceLocalQuery.calculateBalanceAccountByDate({
                  accountId: item,
                  date: prevTransaction.recordAt,
                });
              }
            }
          }
        });
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Soft deletes a transaction by its ID and updates the balances accordingly.
 *
 * @input
 * - id: string - The ID of the transaction to delete
 *
 * @output
 * - void on success
 * - Promise.reject({success: false, error}) on failure
 *
 * @flow
 * 1. Soft delete the transaction in the local database
 * 2. Sync deletion to Firebase (or queue for sync if fails)
 * 3. Delete balance records for the affected account(s)
 * 4. If it was a transfer transaction, also delete balance record for the destination account
 */
export const deleteTransactionById = async (id: string) => {
  try {
    const transactionDeleted = await transactionLocalQuery.softDeleteTransactionById(id);

    // sync to firebase
    await transactionsFb.deleteTransactionById(transactionDeleted.id).catch(async (error) => {
      await syncQueueLocalQuery.updateSyncQueueItem({
        recordId: transactionDeleted.id,
        payload: transactionDeleted._raw,
        tableName: TRANSACTIONS,
        action: SyncQueueAction.DELETE,
      });
    });

    // delete & calculate balance
    await balanceLocalQuery.deleteBalance({
      accountId: transactionDeleted.accountId,
      transactionId: transactionDeleted.id,
    });
    if (transactionDeleted.toAccountId) {
      await balanceLocalQuery.deleteBalance({
        accountId: transactionDeleted.toAccountId,
        transactionId: transactionDeleted.id,
      });
    }
  } catch (error) {
    throw error;
  }
};
