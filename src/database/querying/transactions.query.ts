import { database } from 'database/index';
import { TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import { queryUpdateUseCountTransactionCategory } from './transactionsCategory.query';
import { queryAddTransactionBalance } from './balance.query';

export type GetTransactionByDate = {
  date: string;
  accountId: string;
};

/** observe */

export const getTransactionByIdObserve = (id: string) =>
  database.get<TransactionModel>(TRANSACTIONS).findAndObserve(id);

/** read */
/** query list transaction group by date  */
export const queryTransactionLisGroupByDate = async (accountId: string) => {
  const query = `SELECT DISTINCT 
      strftime('%Y-%m-%d', datetime(dateTimeAt/1000, 'unixepoch')) AS date 
      FROM ${TRANSACTIONS}
      WHERE accountId='${accountId}' AND _status != 'deleted'
      ORDER BY dateTimeAt DESC 
    `;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
  });
};

export const queryTransactionsByDate = async ({ date, accountId }: GetTransactionByDate) => {
  const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();
  const query = `SELECT tran.*, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      WHERE tran.accountId='${accountId}' AND tran._status != 'deleted' AND tran.dateTimeAt BETWEEN ${startOfDay} AND ${endOfDay}
      ORDER BY tran.dateTimeAt DESC 
    `;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
  });
};

export const queryTransactionById = async (id: string) => {
  const query = `select * from ${TRANSACTIONS} where id='${id}' and _status != 'deleted'`;
  return await database.read(async () => {
    const res = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    return res[0] || {};
  });
};

/** create */
/**
 *
 * @param transaction : TTransactions
 * add new transaction , if success then update useCount in transaction category
 */
export const queryAddNewTransaction = async (transaction: TTransactions) => {
  return await database.write(async (writer) => {
    const res = await database.get<TransactionModel>(TRANSACTIONS).create((item) => {
      Object.assign(item, transaction);
    });
    await writer.callWriter(() => {
      queryUpdateUseCountTransactionCategory(res.categoryId);
      // queryAddTransactionBalance({
      //   accountId: res.accountId,
      //   transactionId: res.id,
      // });
      return Promise.resolve(true);
    });
    return res;
  });
};
/** update */
/**
 *
 * @param id
 * @param data
 * @returns void
 *
 * update transaction by id , if update successfully then update useCount in transaction category
 *
 */
export const queryUpdateTransaction = async ({ id, data }: { id: string; data: TTransactions }) => {
  let useDiffCategory = false;
  await database.write(async () => {
    const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);
    useDiffCategory = res.categoryId !== data.categoryId;
    await res.update((item) => {
      Object.assign(item, data);
    });
    if (!useDiffCategory) return;
  });
};
/** delete */

export const queryDeleteTransactionById = async (id: string) => {
  try {
    return await database.write(async () => {
      const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);
      await res.markAsDeleted();
      return true;
    });
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
};
