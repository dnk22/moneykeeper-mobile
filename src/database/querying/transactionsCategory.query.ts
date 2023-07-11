import { database } from 'database/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { TTransactionsCategory } from 'database/types';
import { TransactionCategoryData } from 'utils/data';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_TYPE } from 'utils/constant';
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
    console.log(error, 'fetch getAllTransactionGroupIds err');
  }
};

export const getTransactionCategoryById = async (id: string) => {
  try {
    return await database.read(async () => {
      const res = database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY).find(id);
      return res;
    });
  } catch (error) {
    console.log(error, 'fetch getTransactionCategoryById err');
    return null;
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
    console.log(error, 'fetch fetchGroupTransactionCategory err');
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

export const getMostUsedOrRecentTransactionCategoryUsed = async ({
  categoryType,
  column,
}: {
  categoryType: TRANSACTION_CATEGORY_TYPE;
  column: 'last_use_at' | 'use_count';
}) => {
  return await database.read(async () => {
    return await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .query(
        Q.where('category_type', categoryType),
        Q.where(column, Q.notEq(null)),
        Q.sortBy(column, Q.desc),
        Q.take(4),
      )
      .fetch();
  });
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
          tCategory.value = record.value;
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

export const updateUseCountTransactionCategory = async (id: string) => {
  try {
    const now = new Date();
    const transactionCategory = await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .find(id);
    await transactionCategory.update((item) => {
      item.useCount = item.useCount + 1;
      item.lastUseAt = now.getTime();
    });
    return true;
  } catch (error) {
    console.log(error, 'updateUseCountTransactionCategory err');
  }
};

/** delete */

export const deleteTransactionCategoryById = async (id: string) => {
  try {
    return await database.write(async () => {
      const transactionCategoryCollection =
        database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY);

      // Find the parent record by id
      const parentRecord = await transactionCategoryCollection.find(id);

      // Find all child records by parent_id
      const childRecords = await transactionCategoryCollection
        .query(Q.where('parent_id', id))
        .fetch();

      // Delete all child records recursively
      async function deleteChildRecords(records: TransactionCategoryModel[]) {
        for (const record of records) {
          await record.markAsDeleted();
        }
      }
      await deleteChildRecords(childRecords);

      // Delete the parent record
      await parentRecord.markAsDeleted();

      return {
        status: true,
        message: 'Deleted Success',
      };
    });
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};
