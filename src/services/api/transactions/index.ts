import { TRANSACTIONS } from 'database/constants';
import { SyncQueueAction } from 'database/models/syncQueue.model';
import {
  transactionLocalQuery,
  balanceLocalQuery,
  syncQueueLocalQuery,
} from 'database/querying';
import { TTransactions } from 'database/types';
import { transactionsFb } from 'services/firebase/db/transactions';

/**
 * Updates a transaction record, including creating a new transaction if `id` is not provided.
 * Also updates related counts and balances accordingly.
 *
 * @param id - Optional. The ID of the transaction to update. If not provided, a new transaction is created.
 * @param data - The data for the transaction, including the amount, category ID, etc.
 * @returns Promise<{ success: boolean, error?: any }>
 */
export const updateTransaction = async ({ data }: { data: TTransactions }) => {
  try {
    // If no ID is provided, create a new transaction
    if (!data?.id) {
      const transactionCreated = await transactionLocalQuery.addNewTransaction(data);
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
      const { id, ...dataWithoutId } = data;
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
          // Update balance
          if (isUpdateBalance) {
            // update balance với thông tin từ transactionUpdated
            await balanceLocalQuery.updateBalance({
              transactionId: transactionUpdated.id,
              accountId: prevTransaction.accountId,
              accountToUpdateId: transactionUpdated.accountId,
              movementAmount: transactionUpdated.amount,
              dateRecord: transactionUpdated.recordAt,
            });
            // // nếu account thay đổi, update lại balance account cũ
            if (prevTransaction.accountId !== transactionUpdated.accountId) {
              console.log('account change');
              await balanceLocalQuery.calculateBalanceAccountByDate({
                accountId: prevTransaction.accountId,
                date: prevTransaction.recordAt,
              });
            }
          }
        });
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a transaction record, including creating a new transaction if `id` is not provided.
 * Also updates account balances accordingly.
 *
 * @param id - Optional. The ID of the transaction to update. If not provided, a new transaction is created.
 * @param data - The data for the transaction, including the amount, account IDs, etc.
 * @returns Promise<{ success: boolean, error?: any }>
 */
export const updateTransactionTransfer = async ({
  id,
  data,
}: {
  id?: string;
  data: TTransactions;
}) => {
  // Convert transaction amount for transfer: negative for source account, positive for destination account
  const requestData = {
    ...data,
    amount: -Math.abs(data.amount),
    toAmount: Math.abs(data.amount),
  };
  try {
    if (!id) {
      // Create a new transaction
      // return queryAddNewTransaction(requestData).then(async (transaction) => {
        // Prepare data for updating account balances after a new transaction
    //     const requestDataBalance = {
    //       [data.accountId]: {
    //         id: transaction.id,
    //         accountId: transaction.accountId,
    //         amount: transaction.amount,
    //         recordAt: transaction.recordAt,
    //       },
    //       [data.toAccountId]: {
    //         id: transaction.id,
    //         accountId: transaction.toAccountId,
    //         amount: transaction.toAmount,
    //         recordAt: transaction.recordAt,
    //       },
    //     };
    //     // Update balances and calculate new balances for accounts involved in the transaction
    //     for await (const item of [data.accountId, data.toAccountId]) {
    //       await queryAddNewBalanceTransaction(requestDataBalance[item]);
    //       await queryCalculateAllBalanceAfterDate({
    //         accountId: requestDataBalance[item].accountId,
    //         date: new Date(requestDataBalance[item].recordAt).getTime(),
    //       });
    //     }
    //     return {
    //       success: true,
    //     };
    //   });
    // } else {
    //   // Update an existing transaction
    //   delete requestData.id; // Remove ID from the request data
    //   return queryUpdateTransaction({ id, data: requestData }).then(
    //     async ({
    //       isUpdateBalance,
    //       transactionUpdated,
    //       prevAccountId,
    //       prevToAccountId,
    //       prevDate,
    //     }: any) => {
    //       /** Retrieve a list of account IDs to calculate the balance after the update. */
    //       const listAccountUpdateAfterUpdateTransfer = [
    //         ...new Set(
    //           [
    //             transactionUpdated.accountId,
    //             transactionUpdated.toAccountId,
    //             prevAccountId,
    //             prevToAccountId,
    //           ].filter((item) => item),
    //         ),
    //       ];

          /**
           * Prepare request data for updating balances after a transaction has been updated.
           * This data structure is used to represent the changes in account balances.
           */
      //     const requestDataBalance = {
      //       [data.accountId]: {
      //         id: transactionUpdated.id,
      //         accountId: transactionUpdated.accountId,
      //         amount: transactionUpdated.amount,
      //         recordAt: transactionUpdated.recordAt,
      //         accountIdQuery: prevAccountId,
      //       },
      //       [data.toAccountId]: {
      //         id: transactionUpdated.id,
      //         accountId: transactionUpdated.toAccountId,
      //         amount: transactionUpdated.toAmount,
      //         recordAt: transactionUpdated.recordAt,
      //         accountIdQuery: prevToAccountId || transactionUpdated.toAccountId,
      //       },
      //     };
      //     if (isUpdateBalance) {
      //       for await (const item of [data.accountId, data.toAccountId]) {
      //         await queryUpdateBalanceTransaction(
      //           requestDataBalance[item],
      //           requestDataBalance[item].accountIdQuery,
      //         );
      //       }
      //     }
      //     /** Iterate through the list of accounts that need balance calculation after a transfer update. */
      //     for await (const item of listAccountUpdateAfterUpdateTransfer) {
      //       await queryCalculateAllBalanceAfterDate({
      //         accountId: item,
      //         date: prevDate,
      //       });
      //     }
      //     return {
      //       success: true,
      //     };
      //   },
      // );
    }
  } catch ({ error }) {
    return Promise.reject({
      success: false,
      error,
    });
  }
};

/** delete */
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
    return Promise.reject({
      success: false,
      error,
    });
  }
};
