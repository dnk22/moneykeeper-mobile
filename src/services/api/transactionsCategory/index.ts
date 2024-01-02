import {
  queryGetParentCategoryList,
  queryMostUsedOrRecentTransactionCategoryUsed,
  queryDeleteTransactionCategoryById,
  queryTransactionCategoryById,
  queryAddTransactionCategory,
  queryUpdateTransactionCategory,
  queryGetLendBorrowData,
  queryGetExpenseIncome,
  importDefaultTransactionCategory,
} from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

type getMostUsedOrRecentTransactionProps = {
  categoryType: TRANSACTION_CATEGORY_TYPE;
  column: 'lastUseAt' | 'useCount';
};

/** read */
export const getLendBorrowCategory = async () => {
  return await queryGetLendBorrowData();
};

export const getExpenseAndIncome = async ({ type }: { type: TRANSACTION_CATEGORY_TYPE }) => {
  return await queryGetExpenseIncome({ type });
};

export const getMostUsedOrRecentTransaction = async (
  params: getMostUsedOrRecentTransactionProps,
) => {
  try {
    const res = await queryMostUsedOrRecentTransactionCategoryUsed(params);
    return res;
  } catch (error) {
    console.log(error, 'getMostUsedOrRecentTransaction err ');
    return [];
  }
};

export const getParentList = async (type: any) => {
  try {
    const res = await queryGetParentCategoryList(type);
    return res;
  } catch (error) {
    console.log(error, 'getParentList err ');
    return [];
  }
};

export const getTransactionCategoryByID = async (id: string) => {
  try {
    const res = await queryTransactionCategoryById(id);
    return res;
  } catch (error) {
    console.log(error, 'getTransactionCategoryByID err ');
    return [];
  }
};

/** create */
export async function importTransactionCategoryDataLocal() {
  return await importDefaultTransactionCategory();
}

/** update */
export const updateTransactionCategory = async ({ id, data }: { id?: string; data: any }) => {
  try {
    if (id) {
      return await queryUpdateTransactionCategory({ id, data });
    } else {
      return await queryAddTransactionCategory(data);
    }
  } catch (error) {
    console.log(error, 'deleteTransactionCategoryByID err ');
    return { status: false, errorMessage: 'fail' };
  }
};

/** delete */
export const deleteTransactionCategoryByID = async (id: string) => {
  try {
    const res = await queryDeleteTransactionCategoryById(id);
    return res;
  } catch (error) {
    console.log(error, 'deleteTransactionCategoryByID err ');
    return { status: false, errorMessage: 'fail' };
  }
};
