import { database } from 'database/index';
import { TRANSACTIONS } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import { updateUseCountTransactionCategory } from './transactionsCategory.query';

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
    .query(Q.where('account_id', accountId))
    .observeCount();

export const getTransactionsByDateCountObserve = ({ date, accountId }: GetTransactionByDate) => {
  const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();
  return database
    .get<TransactionModel>(TRANSACTIONS)
    .query(
      Q.where('account_id', accountId),
      Q.and(Q.where('date_time_at', Q.between(startOfDay, endOfDay))),
      Q.sortBy('date_time_at', Q.desc),
    )
    .observe();
};

/** read */
/** querying Transaction by multi condition  */
export const getTransactionLisGroupByDate = async ({ accountId }: GetTransactionProps) => {
  try {
    const query = `SELECT distinct 
      strftime('%Y-%m-%d', datetime(date_time_at/1000, 'unixepoch')) AS date 
      FROM ${TRANSACTIONS} 
      WHERE account_id='${accountId}' AND _status is not 'deleted' 
      ORDER BY date_time_at DESC 
    `;
    return await database.read(async () => {
      const dateList = await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return dateList;
    });
  } catch (error) {
    console.log(error, 'read getTransactionByCondition err');
  }
};

export const getTransactionById = async (id: string) => {
  try {
    return await database.read(async () => {
      const res = database.get<TransactionModel>(TRANSACTIONS).find(id);
      return res;
    });
  } catch (error) {
    console.log(error, 'read getTransactionById err');
  }
};

/** create */
/**
 *
 * @param transaction : TTransactions
 * add new transaction , if success then update useCount in transaction category
 */
export const addNewTransaction = async (transaction: TTransactions) => {
  try {
    await database.write(async () => {
      const res = database.get<TransactionModel>(TRANSACTIONS).create((item) => {
        Object.assign(item, transaction);
      });
      await updateUseCountTransactionCategory(transaction.transactionsCategoryId);
      return res;
    });
  } catch (error) {
    console.log(error);
  }
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
export const updateTransactionById = async ({ id, data }: { id: string; data: TTransactions }) => {
  let useDiffCategory = false;
  await database.write(async () => {
    const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);
    useDiffCategory = res.transactionsCategoryId !== data.transactionsCategoryId;
    await res.update((item) => {
      Object.assign(item, data);
    });
    if (!useDiffCategory) return;
    await updateUseCountTransactionCategory(data.transactionsCategoryId);
  });
};
/** delete */

export const deleteTransactionById = async (id: string) => {
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
