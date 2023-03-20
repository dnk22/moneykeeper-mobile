import { database } from 'database/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';

/** observe */
export const getTransactionCategoryParentObserve = (type: TRANSACTION_CATEGORY_TYPE) =>
  database
    .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
    .query(Q.where('category_type', type), Q.where('parent_id', Q.eq(null)))
    .observe();

export const getTransactionCategoryChildrenObserve = (
  type: TRANSACTION_CATEGORY_TYPE,
  id: string,
) =>
  database
    .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
    .query(Q.where('category_type', type), Q.where('parent_id', id))
    .observe();

/** read */
export const getAllTransactionGroupIds = async (type: TRANSACTION_CATEGORY_TYPE) => {
  try {
    return await database.read(async () => {
      const res = database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query(Q.where('category_type', type), Q.where('parent_id', Q.eq(null)))
        .fetch();
      return res;
    });
  } catch (error) {
    console.log(error, 'fetch group transaction category err');
  }
};

export const getTransactionCategoryById = async (id: string) => {
  try {
    return await database.read(async () => {
      const res = database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).find(id);
      return res;
    });
  } catch (error) {
    console.log(error, 'fetch group transaction category err');
  }
};

export const fetchGroupTransactionCategory = async () => {
  try {
    return await database.read(async () => {
      const res = database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query(Q.where('parent_id', Q.eq(null)))
        .fetch();
      return res;
    });
  } catch (error) {
    console.log(error, 'fetch group transaction category err');
  }
};
/** create */
export const addTransactionCategory = async (tCategory: TTransactionsCategory) => {
  try {
    await database.write(async () => {
      const res = database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).create((item) => {
        Object.assign(item, tCategory);
      });
      return res;
    });
  } catch (error) {
    console.log(error, 'add transaction category err');
  }
};
/** update */

/** delete */
