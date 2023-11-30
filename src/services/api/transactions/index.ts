import {
  queryAddNewTransaction,
  queryDeleteTransactionById,
  queryTransactionById,
  queryTransactionLisGroupByDate,
  queryTransactionsByDate,
  queryUpdateTransaction,
} from 'database/querying';
import { TTransactions } from 'database/types';

export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      return await queryAddNewTransaction(data);
    } else {
      return await queryUpdateTransaction({ id, data });
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
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

export const deleteTransactionById = async (id: string) => {
  try {
    return await queryDeleteTransactionById(id);
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
    return await queryTransactionsByDate({ accountId, date });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
