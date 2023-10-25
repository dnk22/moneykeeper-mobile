import {
  queryGroupTransactionCategory,
  queryMostUsedOrRecentTransactionCategoryUsed,
  queryDeleteTransactionCategoryById,
  queryTransactionCategoryById,
  queryAddTransactionCategory,
  queryUpdateTransactionCategory,
  queryTransactionCategoryByParams,
} from 'database/querying';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/constant';

type getMostUsedOrRecentTransactionProps = {
  categoryType: TRANSACTION_CATEGORY_TYPE;
  column: 'lastUseAt' | 'useCount';
};
type getTransactionCategoryByParamsProps = {
  column: any;
  value: any;
};

export const getTransactionCategoryByParams = async (params: getTransactionCategoryByParamsProps) => {
  try {
    const res = await queryTransactionCategoryByParams(params);
    return res;
  } catch (error) {
    console.log(error, 'getTransactionCategoryByParams err ');
    return [];
  }
};

export const getMostUsedOrRecentTransaction = async (params: getMostUsedOrRecentTransactionProps) => {
  try {
    const res = await queryMostUsedOrRecentTransactionCategoryUsed(params);
    return res;
  } catch (error) {
    console.log(error, 'getMostUsedOrRecentTransaction err ');
    return [];
  }
};

export const getGroupList = async (type: any) => {
  try {
    const res = await queryGroupTransactionCategory(type);
    return res;
  } catch (error) {
    console.log(error, 'getGroupList err ');
    return [];
  }
};

export const getTransactionCategoryByID = async (id: string) => {
  try {
    const res = await queryTransactionCategoryById(id);
    return res;
  } catch (error) {
    console.log(error, 'getGroupList err ');
    return [];
  }
};

export const deleteTransactionCategoryByID = async (id: string) => {
  try {
    const res = await queryDeleteTransactionCategoryById(id);
    return res;
  } catch (error) {
    console.log(error, 'deleteTransactionCategoryByID err ');
    return { status: false, errorMessage: 'fail' };
  }
};

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
