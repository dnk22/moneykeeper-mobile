import { TBalance, TAccount } from 'database/types';
import { database } from 'database/index';
import { BalanceModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';

export const queryAddBalance = async (balance: TBalance) => {
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
    const childRecords = await database.get<BalanceModel>(BALANCE).query(Q.where('accountId', accountId)).fetch();

    // Delete all child records recursively
    async function deleteChildRecords(records: BalanceModel[]) {
      for (const record of records) {
        await record.markAsDeleted();
      }
    }
    return await deleteChildRecords(childRecords);
  });
};
