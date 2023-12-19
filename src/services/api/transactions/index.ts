import {
  queryAddNewBalanceTransaction,
  queryAddNewTransaction,
  queryDeleteBalanceById,
  queryDeleteTransactionById,
  queryTransactionById,
  queryTransactionLisGroupByDate,
  queryTransactionsByDate,
  queryUpdateTransaction,
  queryUpdateUseCountTransactionCategory,
} from 'database/querying';
import { TTransactions } from 'database/types';
import { handleError } from 'utils/axios';

export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      return queryAddNewTransaction(data).then(async (res) => {
        await queryUpdateUseCountTransactionCategory(res.categoryId);
        await queryAddNewBalanceTransaction(res);
      });
    } else {
      return await queryUpdateTransaction({ id, data });
    }
  } catch (error) {
    return Promise.reject({
      success: false,
      error,
    });
  }
};

export const getTransactionById = async (id: string) => {
  try {
    return await queryTransactionById(id);
  } catch (error) {
    console.log(error, 'fetch getTransactionById err');
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
    return await queryTransactionsByDate({ accountId, date });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/** delete */
export const deleteTransactionById = async (transactionId: string) => {
  try {
    return queryDeleteTransactionById(transactionId).then(async (id) => {
      await queryDeleteBalanceById(id);
    });
  } catch (error) {
    handleError({ error });
  }
};
