import { BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';
import TransactionCategoryModel from 'database/models/transactionCategory.model';

export const queryGetAllBalance = async () => {
  const query = `SELECT * FROM ${TRANSACTION_CATEGORY}`;
  return await database.read(async () => {
    const res = await database
      .get<TransactionCategoryModel>(TRANSACTION_CATEGORY)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    console.log(res);
    return res;
  });
};
