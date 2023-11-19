import {
  queryAddNewTransaction,
  queryDeleteTransactionById,
  queryTransactionById,
  queryUpdateTransaction,
  queryUpdateUseCountTransactionCategory,
} from 'database/querying';
import { TTransactions } from 'database/types';

export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      const res = await queryAddNewTransaction(data);
      if (res.success) {
        return await queryUpdateUseCountTransactionCategory(data.categoryId);
      }
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
    console.log(error, 'deleteTransactionById err');
    return {
      success: false,
      error: 'Có lỗi, vui lòng thử lại.',
    };
  }
};
