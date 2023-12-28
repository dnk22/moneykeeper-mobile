import {
  queryAddNewBalanceTransaction,
  queryAddNewTransaction,
  queryDeleteBalanceById,
  queryDeleteTransactionById,
  queryTransactionById,
  queryTransactionLisGroupByDate,
  queryGetTransactionsListByDate,
  queryCalculateAllBalanceAfterDate,
  queryUpdateTransaction,
  queryUpdateUseCountTransactionCategory,
  queryUpdateBalanceTransaction,
} from 'database/querying';
import { TTransactions } from 'database/types';
import { handleError } from 'utils/axios';

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

export const getTransactionLisGroupByDate = async (accountId: string) => {
  try {
    return await queryTransactionLisGroupByDate(accountId);
  } catch (error) {
    return {
      success: false,
      error,
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
export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      return queryAddNewTransaction(data).then(async (transaction) => {
        await queryUpdateUseCountTransactionCategory(transaction.categoryId);
        await queryAddNewBalanceTransaction(transaction).then(async () => {
          await queryCalculateAllBalanceAfterDate({
            accountId: transaction.accountId,
            date: new Date(transaction.dateTimeAt).getTime(),
          });
        });
        return {
          success: true,
        };
      });
    } else {
      delete data.id;
      return queryUpdateTransaction({ id, data }).then(
        async ({ isUpdateCountCategory, isUpdateBalance }: any) => {
          if (isUpdateCountCategory) {
            await queryUpdateUseCountTransactionCategory(data.categoryId);
          }
          if (isUpdateBalance) {
            await queryUpdateBalanceTransaction({ ...data, id }).then(async (balance) => {
              if (balance) {
                return await queryCalculateAllBalanceAfterDate({
                  accountId: data.accountId,
                  date: new Date(data.dateTimeAt).getTime(),
                });
              }
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
const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
export const updateTransactionTransfer = async ({
  id,
  data,
}: {
  id?: string;
  data: TTransactions;
}) => {
  const requestData = {
    ...data,
    amount: -Math.abs(data.amount),
    toAmount: Math.abs(data.amount),
  };
  try {
    if (!id) {
      return queryAddNewTransaction(requestData).then(async (transaction) => {
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
      delete requestData.id;
      return queryUpdateTransaction({ id, data: requestData }).then(
        async ({
          isUpdateBalance,
          transactionUpdated,
          prevAccountId,
          prevToAccountId,
          prevDate,
        }: any) => {
          const listAccountUpdateAfterUpdateTransfer = [
            ...new Set([
              transactionUpdated.accountId,
              transactionUpdated.toAccountId,
              prevAccountId,
              prevToAccountId,
            ]),
          ];
          const requestDataBalance = {
            [data.accountId]: {
              id: transactionUpdated.id,
              accountId: transactionUpdated.accountId,
              amount: transactionUpdated.amount,
              dateTimeAt: transactionUpdated.dateTimeAt,
              prevAccountId,
            },
            [data.toAccountId]: {
              id: transactionUpdated.id,
              accountId: transactionUpdated.toAccountId,
              amount: transactionUpdated.toAmount,
              dateTimeAt: transactionUpdated.dateTimeAt,
              prevAccountId: prevToAccountId,
            },
          };
          if (isUpdateBalance) {
            for await (const item of [data.accountId, data.toAccountId]) {
              await queryUpdateBalanceTransaction(
                requestDataBalance[item],
                requestDataBalance[item].prevAccountId,
              );
            }
          }
          for await (const item of listAccountUpdateAfterUpdateTransfer) {
            await queryCalculateAllBalanceAfterDate({
              accountId: item,
              date: new Date(prevDate).getTime(),
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
