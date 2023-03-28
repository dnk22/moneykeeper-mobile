import { database } from 'database/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { TTransactionsCategory } from 'database/types';
import { TransactionCategoryData, TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { Q } from '@nozbe/watermelondb';

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

export const fetchGroupTransactionCategory = async (type: TRANSACTION_CATEGORY_TYPE) => {
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

export const getIsTransactionCategoryDataExist = async () => {
  try {
    return await database.read(async () => {
      return await database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query()
        .fetchCount();
    });
  } catch (error) {
    console.log(error, 'get transaction category exist err');
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

export const importDefaultTransactionCategory = async () => {
  try {
    await database.write(async () => {
      for (const record of TransactionCategoryData) {
        await database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).create((tCategory) => {
          tCategory.categoryName = record.categoryName;
          tCategory.categoryType = record.categoryType;
          tCategory.parentId = record.parentId;
          tCategory.description = record.description;
          tCategory.isSystem = record.isSystem;
          tCategory.useCount = record.useCount;
        });
      }
    });
    console.log('Import transaction category completed!');
  } catch (error) {
    console.log('Import transaction category failed: ', error);
  }
};
/** update */

export const updateTransactionCategory = async ({
  id,
  data,
}: {
  id: string;
  data: TTransactionsCategory;
}) => {
  try {
    await database.write(async () => {
      const res = await database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).find(id);
      await res.update((item) => {
        Object.assign(item, data);
      });
    });
  } catch (error) {
    console.log(error, 'update err');
  }
};
/** delete */
export const deleteTransactionCategoryById = async (id?: string) => {
  if (!id) return;
  try {
    return await database.write(async () => {
      const res = await database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).find(id);
      await res.markAsDeleted();
      return 'delete success';
    });
  } catch (error) {
    console.log(error, 'delete transaction category err');
  }
};
