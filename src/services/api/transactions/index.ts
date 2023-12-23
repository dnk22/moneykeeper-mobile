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
      return queryAddNewTransaction(data).then(async (res) => {
        await queryUpdateUseCountTransactionCategory(res.categoryId);
        await queryAddNewBalanceTransaction(res);
        return {
          success: true,
        };
      });
    } else {
      delete data.id;
      return queryUpdateTransaction({ id, data }).then(
        async ({ isUpdateCountCategory, isUpdateBalance }) => {
          if (isUpdateCountCategory) {
            await queryUpdateUseCountTransactionCategory(data.categoryId);
          }
          if (isUpdateBalance) {
            await queryUpdateBalanceTransaction(data).then(async (balance) => {
              console.log(balance, 'balance');
              return await queryCalculateAllBalanceAfterDate({
                accountId: data.accountId,
                date: data.dateTimeAt,
                openAmount: balance.closingAmount,
              });
            });
          }
          return {
            success: true,
          };
        },
      );
    }
  } catch (error) {
    return Promise.reject({
      success: false,
      error,
    });
  }
};

/** delete */
export const deleteTransactionById = async (transaction: TTransactions) => {
  try {
    return queryDeleteTransactionById(transaction.id).then(async (id) => {
      queryDeleteBalanceById(id);
      await queryCalculateAllBalanceAfterDate({
        accountId: transaction.accountId,
        date: transaction.dateTimeAt,
        openAmount: transaction.closingAmount - transaction.amount,
      });
      return true;
    });
  } catch (error) {
    handleError({ error });
  }
};
