import { database } from 'database/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { Q } from '@nozbe/watermelondb';

export const queryUpdateUseCountTransactionCategory = async (id: string) => {
  const date = new Date();
  return await database.write(async () => {
    const transactionCategory = await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .find(id);
    return await transactionCategory.update((item) => {
      item.useCount = item.useCount + 1;
      item.lastUseAt = date.getTime();
    });
  });
};

/** delete */
export const queryDeleteTransactionCategoryById = async (id: string) => {
  try {
    return await database.write(async () => {
      const transactionCategoryCollection =
        database.get<TransactionCategoryModel>(TRANSACTION_CATEGORY);

      // Find the parent record by id
      const parentRecord = await transactionCategoryCollection.find(id);

      // Find all child records by parentId
      const childRecords = await transactionCategoryCollection
        .query(Q.where('parentId', id))
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
