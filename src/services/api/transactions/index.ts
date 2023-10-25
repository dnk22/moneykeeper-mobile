import { Q } from '@nozbe/watermelondb';
import { TRANSACTIONS } from 'database/constants';
import { database } from 'database/index';
import { TransactionModel } from 'database/models';
import { addNewTransaction, queryTransactionById, updateTransactionById } from 'database/querying';
import { TTransactions } from 'database/types';

type transactionRequestUpdateProp = {
  id?: string;
  data: TTransactions;
};

export const updateTransaction = async ({ id, data }: transactionRequestUpdateProp) => {
  try {
    if (!id) {
      await addNewTransaction(data);
    } else {
      await updateTransactionById({ id, data });
    }
    return true;
  } catch (error) {
    console.log(error);
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
