import { TBalance } from 'database/types';
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
    return {
      success: false,
      error,
    };
  }
};

export const queryAllBalance = async () => {
  try {
    return await database.read(async () => {
      return await database
        .get<BalanceModel>(BALANCE)
        .query(
          Q.unsafeSqlQuery(
            `SELECT closingAmount, MAX(transactionDateAt)
            FROM ${BALANCE}
            GROUP BY accountId`,
          ),
        )
        .fetch();
    });
  } catch (error) {
    return error;
  }
};
