import { BALANCE, TRANSACTIONS } from 'database/constants';
import { database } from 'database/index';
import { BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';

export const queryGetAllBalance = async () => {
  const query = `select * from ${BALANCE}`;
  // const query2 = `SELECT
  //               bal2.*,
  //               MAX(bal2.transactionDateAt), MAX(bal2._id)
  //             FROM
  //               ${BALANCE} bal2
  //             GROUP BY
  //               bal2.accountId`;
  return await database.read(async () => {
    const res = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    console.log(res);
    return res;
  });
};
