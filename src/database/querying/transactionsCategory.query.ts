import { database } from 'database/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import { TRANSACTION_CATEGORY } from 'database/constants';
import { TTransactionsCategory } from 'database/types';
import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_LEND_BORROW_NAME } from 'utils/constant';
import { Q } from '@nozbe/watermelondb';
import { handleError } from 'utils/axios';
import { TransactionCategoryData } from 'utils/data/transactionCategory.default';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';

const lendAndBorrowCategory = [
  TRANSACTION_LEND_BORROW_NAME.BORROW,
  TRANSACTION_LEND_BORROW_NAME.LEND,
  TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS,
  TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
];

/** read */
export const queryGetLendBorrowData = async () => {
  try {
    return await database.read(async () => {
      return database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query(
          Q.where('categoryName', Q.oneOf(lendAndBorrowCategory)),
          Q.where('_status', Q.notEq('deleted')),
        )
        .unsafeFetchRaw();
    });
  } catch (error) {}
};

export const queryGetExpenseIncome = async ({ type }: { type: TRANSACTION_CATEGORY_TYPE }) => {
  return await database.read(async () => {
    const query = `SELECT id, categoryName, categoryType, parentId, dictionaryKey, icon, isSystem, sortOrder FROM ${TRANSACTION_CATEGORY}
    WHERE _status!='deleted' AND categoryType=${type} AND categoryName NOT IN (${lendAndBorrowCategory
      .map((item) => `"${item}"`)
      .toString()})`;
    const result = await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    return result;
  });
};

export const queryTransactionCategoryById = async (id: string) => {
  try {
    const query = `SELECT * FROM ${TRANSACTION_CATEGORY} WHERE id='${id}' AND _status != 'deleted'`;
    return await database.read(async () => {
      const res = await database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return res[0] || {};
    });
  } catch (error) {
    console.log(error, 'fetch queryTransactionCategoryById err');
    return null;
  }
};

export const queryGetParentCategoryList = async (type: TRANSACTION_CATEGORY_TYPE) => {
  try {
    return await database.read(async () => {
      const res = await database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query(
          Q.and(
            Q.where('parentId', Q.eq('')),
            Q.where('_status', Q.notEq('deleted')),
            Q.where('categoryType', type),
            Q.where(
              'categoryName',
              Q.notIn([
                TRANSACTION_LEND_BORROW_NAME.BORROW,
                TRANSACTION_LEND_BORROW_NAME.LEND,
                TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS,
                TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
              ]),
            ),
          ),
        )
        .fetch();
      return res;
    });
  } catch (error) {
    console.log(error, 'queryGetParentCategoryList err');
  }
};

export const queryMostUsedOrRecentTransactionCategoryUsed = async ({
  categoryType,
  column,
}: {
  categoryType: TRANSACTION_CATEGORY_TYPE;
  column: 'lastUseAt' | 'useCount';
}) => {
  return await database.read(async () => {
    return await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .query(
        Q.and(
          Q.where('_status', Q.notEq('deleted')),
          Q.where('categoryType', categoryType),
          Q.where(column, Q.notEq(column === 'lastUseAt' ? null : 0)),
          Q.where(
            'categoryName',
            Q.notIn([
              TRANSACTION_LEND_BORROW_NAME.BORROW,
              TRANSACTION_LEND_BORROW_NAME.LEND,
              TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS,
              TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
            ]),
          ),
        ),
        Q.take(10),
        Q.sortBy(column, Q.desc),
      )
      .fetch();
  });
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

export const importDefaultTransactionCategory = async () => {
  try {
    const isHaveDataInit = await database.read(async () => {
      return await database
        .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
        .query()
        .fetchCount();
    });
    if (Boolean(isHaveDataInit)) {
      return;
    }
    const updateStatements: SQLiteQuery[] = TransactionCategoryData.map((record) => {
      const {
        id,
        categoryName,
        categoryType,
        parentId,
        description,
        isSystem,
        useCount,
        icon,
        sortOrder,
        dictionaryKey,
      } = record;
      return [
        `INSERT INTO ${TRANSACTION_CATEGORY} (id, categoryName, categoryType, parentId, description, isSystem, useCount, icon, sortOrder, dictionaryKey, _changed, _status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          categoryName,
          categoryType,
          parentId,
          description,
          isSystem,
          useCount,
          icon,
          sortOrder,
          dictionaryKey,
          '',
          'created',
        ],
      ];
    });
    return database.write(async () => {
      return await database.adapter.unsafeExecute({
        sqls: updateStatements,
      });
    });
  } catch (error) {
    console.log('Import transaction category failed: ', error);
  }
};

export const queryAddTransactionCategory = async (tCategory: TTransactionsCategory) => {
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
export const queryUpdateTransactionCategory = async ({
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

export const queryUpdateUseCountTransactionCategory = async (id: string) => {
  try {
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
  } catch (error) {
    return handleError({
      error: 'UPD-COUNT-TRANS-CAT',
    });
  }
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
