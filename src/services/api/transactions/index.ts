import { Q } from '@nozbe/watermelondb';
import { TRANSACTIONS } from 'database/constants';
import { database } from 'database/index';
import { TransactionModel } from 'database/models';
import {
  queryAddNewTransaction,
  queryTransactionById,
  queryUpdateTransaction,
  queryUpdateUseCountTransactionCategory,
} from 'database/querying';
import { TTransactions } from 'database/types';

export const updateTransaction = async ({ id, data }: { id?: string; data: TTransactions }) => {
  try {
    if (!id) {
      const res = await queryAddNewTransaction(data);
      if (res.success) {
        await queryUpdateUseCountTransactionCategory(data.categoryId);
      }
    } else {
      await queryUpdateTransaction({ id, data });
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getTransactionById = async (id: string) => {
  try {
    const query = `select * from ${TRANSACTIONS} where id='${id}' and _status != 'deleted'`;
    return await database.read(async () => {
      const res = await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return res[0] || {};
    });
  } catch (error) {
    console.log(error, 'fetch getTransactionById err');
    return null;
  }
};
