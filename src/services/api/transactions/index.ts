import {
  queryAddNewBalanceTransaction,
  queryAddNewTransaction,
  queryDeleteBalanceById,
  queryDeleteTransactionById,
  queryTransactionById,
  queryGetTransactionsListByDate,
  queryCalculateAllBalanceAfterDate,
  queryUpdateTransaction,
  queryUpdateUseCountTransactionCategory,
  queryUpdateBalanceTransaction,
} from 'database/querying';
import { TTransactions } from 'database/types';
import { handleError } from 'utils/axios';

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

/** read */
export const getTransactionById = async (id: string) => {
  try {
    return await queryTransactionById(id);
  } catch (error) {
    return {
      success: false,
      error: 'Có lỗi, vui lòng thử lại.',
    };
  }
};

export const getTransactionByDate = async (accountId: string, date: string) => {
  try {
    return await queryGetTransactionsListByDate({ accountId, date });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/** update */
/**
 * Updates a transaction record, including creating a new transaction if `id` is not provided.
 * Also updates related counts and balances accordingly.
 *
 * @param id - Optional. The ID of the transaction to update. If not provided, a new transaction is created.
 * @param data - The data for the transaction, including the amount, category ID, etc.
 * @returns Promise<{ success: boolean, error?: any }>
 */
export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      return queryAddNewTransaction(data).then(async (transaction) => {
        // Update the usage count for the transaction category
        queryUpdateUseCountTransactionCategory(transaction.categoryId);
        // Update the balance and calculate new balances after the transaction
        await queryAddNewBalanceTransaction(transaction);
        await queryCalculateAllBalanceAfterDate({
          accountId: transaction.accountId,
          date: new Date(transaction.dateTimeAt).getTime(),
        });
        return {
          success: true,
        };
      });
    } else {
      delete data.id;
      return await queryUpdateTransaction({ id, data }).then(
        async ({
          isUpdateCountCategory,
          isUpdateBalance,
          prevAccountId,
          prevToAccountId,
          prevDate,
        }: any) => {
          if (isUpdateCountCategory) {
            queryUpdateUseCountTransactionCategory(data.categoryId);
          }
          if (isUpdateBalance) {
            await queryUpdateBalanceTransaction({ ...data, id }, prevAccountId);
            await queryCalculateAllBalanceAfterDate({
              accountId: data.accountId,
              date: prevDate,
            });
            if (prevToAccountId) {
              await queryDeleteBalanceById(id, prevToAccountId);
              await queryCalculateAllBalanceAfterDate({
                accountId: prevToAccountId,
                date: prevDate,
              });
            }
          }
          return {
            success: true,
          };
        },
      );
    }
  } catch ({ error }) {
    return Promise.reject({
      success: false,
      error,
    });
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
      return queryAddNewTransaction(requestData).then(async (transaction) => {
        // Prepare data for updating account balances after a new transaction
        const requestDataBalance = {
          [data.accountId]: {
            id: transaction.id,
            accountId: transaction.accountId,
            amount: transaction.amount,
            dateTimeAt: transaction.dateTimeAt,
          },
          [data.toAccountId]: {
            id: transaction.id,
            accountId: transaction.toAccountId,
            amount: transaction.toAmount,
            dateTimeAt: transaction.dateTimeAt,
          },
        };
        // Update balances and calculate new balances for accounts involved in the transaction
        for await (const item of [data.accountId, data.toAccountId]) {
          await queryAddNewBalanceTransaction(requestDataBalance[item]);
          await queryCalculateAllBalanceAfterDate({
            accountId: requestDataBalance[item].accountId,
            date: new Date(requestDataBalance[item].dateTimeAt).getTime(),
          });
        }
        return {
          success: true,
        };
      });
    } else {
      // Update an existing transaction
      delete requestData.id; // Remove ID from the request data
      return queryUpdateTransaction({ id, data: requestData }).then(
        async ({
          isUpdateBalance,
          transactionUpdated,
          prevAccountId,
          prevToAccountId,
          prevDate,
        }: any) => {
          /** Retrieve a list of account IDs to calculate the balance after the update. */
          const listAccountUpdateAfterUpdateTransfer = [
            ...new Set(
              [
                transactionUpdated.accountId,
                transactionUpdated.toAccountId,
                prevAccountId,
                prevToAccountId,
              ].filter((item) => item),
            ),
          ];

          /**
           * Prepare request data for updating balances after a transaction has been updated.
           * This data structure is used to represent the changes in account balances.
           */
          const requestDataBalance = {
            [data.accountId]: {
              id: transactionUpdated.id,
              accountId: transactionUpdated.accountId,
              amount: transactionUpdated.amount,
              dateTimeAt: transactionUpdated.dateTimeAt,
              accountIdQuery: prevAccountId,
            },
            [data.toAccountId]: {
              id: transactionUpdated.id,
              accountId: transactionUpdated.toAccountId,
              amount: transactionUpdated.toAmount,
              dateTimeAt: transactionUpdated.dateTimeAt,
              accountIdQuery: prevToAccountId || transactionUpdated.toAccountId,
            },
          };
          if (isUpdateBalance) {
            for await (const item of [data.accountId, data.toAccountId]) {
              await queryUpdateBalanceTransaction(
                requestDataBalance[item],
                requestDataBalance[item].accountIdQuery,
              );
            }
          }
          /** Iterate through the list of accounts that need balance calculation after a transfer update. */
          for await (const item of listAccountUpdateAfterUpdateTransfer) {
            await queryCalculateAllBalanceAfterDate({
              accountId: item,
              date: prevDate,
            });
          }
          return {
            success: true,
          };
        },
      );
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
    return await queryDeleteTransactionById(id).then(async (transaction) => {
      await queryDeleteBalanceById(transaction.id).then(async () => {
        await queryCalculateAllBalanceAfterDate({
          accountId: transaction.accountId,
          date: new Date(transaction.dateTimeAt).getTime(),
        });
        if (transaction.toAccountId) {
          await queryCalculateAllBalanceAfterDate({
            accountId: transaction.toAccountId,
            date: new Date(transaction.dateTimeAt).getTime(),
          });
        }
      });
      return {
        success: true,
      };
    });
  } catch (error) {
    return handleError({ error });
  }
};
