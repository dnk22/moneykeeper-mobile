import { TBalance, TAccount } from 'database/types';
import { database } from 'database/index';
import { BalanceModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';

/** read  */
export const queryGetLatestBalanceByDate = async (accountId: string, date: number) => {
  const query = `SELECT closingAmount FROM ${BALANCE}
                WHERE accountId='${accountId}'
                AND (
                  transactionDateAt <= ${date}
                  OR transactionDateAt IS NULL
                )
                ORDER BY transactionDateAt DESC, _id DESC
                LIMIT 1`;
  return await database.read(async () => {
    const result = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    return result[0];
  });
};

/** create */
export const queryAddBalance = async (balance: TBalance) => {
  const query = `SELECT MAX(_id) AS maxId from ${BALANCE}`;
  return await database.write(async () => {
    const result = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    const res = await database.get<BalanceModel>(BALANCE).create((item) => {
      Object.assign(item, { ...balance, _id: result[0].maxId + 1 });
    });
    return res;
  });
};

export const queryAddTransactionBalance = async (balance: TBalance) => {
  return await database.write(async () => {
    return await database.get<BalanceModel>(BALANCE).create((item) => {
      Object.assign(item, balance);
    });
  });
};

export const queryUpdateBalanceAfterUpdateAccount = ({
  accountData,
}: {
  accountData: TAccount;
}) => {
  return database.write(async () => {
    const balance = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.where('accountId', accountData.id))
      .fetch();
    await balance[0].update((bal) => {
      bal.openAmount = accountData.initialAmount;
      bal.closingAmount = accountData.initialAmount;
    });
  });
};

export const queryDeleteBalanceAfterDeleteAccount = (accountId: string) => {
  return database.write(async () => {
    // Find all child records by accountId
    const childRecords = await database
      .get<BalanceModel>(BALANCE)
      .query(Q.where('accountId', accountId))
      .fetch();

    // Delete all child records recursively
    async function deleteChildRecords(records: BalanceModel[]) {
      for (const record of records) {
        await record.markAsDeleted();
      }
    }
    return await deleteChildRecords(childRecords);
  });
};

/** delete */
export const queryDeleteBalanceById = async (id: string) => {
  return await database.write(async () => {
    const res = await database.get<BalanceModel>(BALANCE).find(id);
    await res.markAsDeleted();
    return true;
  });
};
