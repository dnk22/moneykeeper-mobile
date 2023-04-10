import { database } from 'database/index';
import { TRANSACTIONS } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
/** observe */

/** read */
/** querying Transaction by multi condition  */
export type GetTransactionProps = {
  accountId: string;
};

export type GetTransactionByDate = GetTransactionProps & {
  date: string;
};

export const getGroupDateTransaction = async ({ accountId }: GetTransactionProps) => {
  try {
    const query = `SELECT distinct strftime('%Y-%m-%d', datetime(date_time_at/1000, 'unixepoch')) AS dateTimeAt FROM ${TRANSACTIONS} WHERE account_id='${accountId}' ORDER BY date_time_at DESC`;
    return await database.read(async () => {
      const res = database
        .get<TransactionModel>(TRANSACTIONS)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return res;
    });
  } catch (error) {
    console.log(error, 'read getTransactionByCondition err');
  }
};

export const getTransactionByDate = async ({ accountId, date }: GetTransactionByDate) => {
  try {
    const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();

    return await database.read(async () => {
      const res = database
        .get<TransactionModel>(TRANSACTIONS)
        .query(
          Q.where('account_id', accountId),
          Q.and(Q.where('date_time_at', Q.between(startOfDay, endOfDay))),
          Q.sortBy('date_time_at', Q.desc),
        )
        .fetch();
      return res;
    });
  } catch (error) {
    console.log(error, 'read getTransactionByDate err');
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
export const addNewTransaction = async (transaction: TTransactions) => {
  try {
    await database.write(async () => {
      const res = database.get<TransactionModel>(TRANSACTIONS).create((item) => {
        Object.assign(item, transaction);
      });
      return res;
    });
  } catch (error) {
    console.log(error, 'add transaction err');
  }
};
/** update */
export const updateTransactionById = async ({ id, data }: { id: string; data: TTransactions }) => {
  try {
    await database.write(async () => {
      const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);
      await res.update((item) => {
        Object.assign(item, data);
      });
    });
  } catch (error) {
    console.log(error, 'add transaction err');
  }
};
/** delete */
