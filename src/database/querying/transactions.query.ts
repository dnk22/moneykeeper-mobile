import { database } from 'database/index';
import { TRANSACTIONS } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';

export type GetTransactionProps = {
  accountId: string;
};

export type GetTransactionByDate = GetTransactionProps & {
  date: string;
};

/** observe */

export const getTransactionByIdObserve = (id: string) =>
  database.get<TransactionModel>(TRANSACTIONS).findAndObserve(id);

export const getTransactionByAccountCountObserve = (accountId: string) =>
  database
    .get<TransactionModel>(TRANSACTIONS)
    .query(Q.where('accountId', accountId))
    .observeCount();

export const getTransactionsByDateObserve = ({ date, accountId }: GetTransactionByDate) => {
  const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();
  return database
    .get<TransactionModel>(TRANSACTIONS)
    .query(
      Q.where('accountId', accountId),
      Q.and(Q.where('dateTimeAt', Q.between(startOfDay, endOfDay))),
      Q.sortBy('dateTimeAt', Q.desc),
    )
    .observe();
};

/** read */
/** querying Transaction by multi condition  */
export const getTransactionLisGroupByDate = async ({ accountId }: GetTransactionProps) => {
  try {
    const query = `SELECT distinct 
      strftime('%Y-%m-%d', datetime(dateTimeAt/1000, 'unixepoch')) AS date 
      FROM ${TRANSACTIONS} 
      WHERE accountId='${accountId}' AND _status is not 'deleted' 
      ORDER BY dateTimeAt DESC 
    `;
    return await database.read(async () => {
      const dateList = await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return dateList;
    });
  } catch (error) {
    console.log(error, 'read getTransactionLisGroupByDate err');
  }
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
  return await database.write(async () => {
    database.get<TransactionModel>(TRANSACTIONS).create((item) => {
      Object.assign(item, transaction);
    });
    return {
      success: true,
    };
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
