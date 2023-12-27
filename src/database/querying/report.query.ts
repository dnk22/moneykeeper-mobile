import { BALANCE, TRANSACTIONS } from 'database/constants';
import { database } from 'database/index';
import { BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';

export const queryGetAllBalance = async () => {
  const query = `SELECT * FROM ${BALANCE}
  WHERE accountId='${'OyfDHCYy6fKiYypm'}'
  AND (
    transactionDateAt > ${'1703684781518'}
    OR transactionDateAt IS NULL
  )
  ORDER BY transactionDateAt DESC, _id DESC
  LIMIT 10`;
  return await database.read(async () => {
    const res = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    console.log(res);
    return res;
  });
};
