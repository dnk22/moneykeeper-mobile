import { database } from 'database/index';
import { TRANSACTIONS } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
/** observe */

/** read */

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
/** delete */
