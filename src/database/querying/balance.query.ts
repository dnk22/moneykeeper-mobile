import { TBalance, TAccount } from 'database/types';
import { database } from 'database/index';
import { BalanceModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';

export const queryAddBalance = async (balance: TBalance) => {
  try {
    return await database.write(async () => {
      database.get<BalanceModel>(BALANCE).create((item) => {
        Object.assign(item, balance);
      });
      return {
        success: true,
      };
    });
  } catch (error) {
    return Promise.reject({
      success: false,
      error: 'Có lỗi trong quá trình cập nhật số dư.',
    });
  }
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
