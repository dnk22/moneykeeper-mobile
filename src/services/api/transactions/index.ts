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
        queryAddNewBalanceTransaction(transaction).then(async () => {
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
          queryAddNewBalanceTransaction(requestDataBalance[item]).then(async (balance) => {
            await queryCalculateAllBalanceAfterDate({
              accountId: balance.accountId,
              date: new Date(balance.transactionDateAt).getTime(),
              openAmount: balance.closingAmount,
            });
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
          isUpdateBalanceAccountId,
          isUpdateBalanceToAccountId,
          prevAccountId,
          prevToAccountId,
          transaction,
        }: any) => {
          console.log(requestData, 'requestData');
          if (isUpdateBalance || isUpdateBalanceAccountId) {
            console.log('update accountID');
            await queryUpdateBalanceTransaction(transaction, prevAccountId).then(
              async (balance) => {
                if (balance) {
                  return await queryCalculateAllBalanceAfterDate({
                    accountId: data.accountId,
                    date: new Date(data.dateTimeAt).getTime(),
                    openAmount: balance.closingAmount,
                  });
                }
              },
            );
          }
          if (isUpdateBalance || isUpdateBalanceToAccountId) {
            const requestDataBalance = {
              id: transaction.id,
              accountId: transaction.toAccountId,
              amount: transaction.toAmount,
              dateTimeAt: transaction.dateTimeAt,
            };
            await queryUpdateBalanceTransaction(requestDataBalance, prevToAccountId).then(
              async (balance) => {
                if (balance) {
                  return await queryCalculateAllBalanceAfterDate({
                    accountId: balance.accountId,
                    date: new Date(balance.transactionDateAt).getTime(),
                    openAmount: balance.closingAmount,
                  });
                }
              },
            );
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
    return queryDeleteTransactionById(id).then(async (transaction) => {
      await queryDeleteBalanceById(transaction.id).then(async () => {
        await queryCalculateAllBalanceAfterDate({
          accountId: transaction.accountId,
          date: new Date(transaction.dateTimeAt).getTime(),
        });
      });
      return {
        success: true,
      };
    });
  } catch (error) {
    return handleError({ error });
  }
};
