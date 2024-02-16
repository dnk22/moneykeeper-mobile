import { TAccount, TBalance, TTransactions } from 'database/types';
import { database } from 'database/index';
import { BalanceModel, TransactionModel } from 'database/models';
import { BALANCE, TRANSACTIONS } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import { isEmpty } from 'lodash';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';
import { handleError } from 'utils/axios';

/** read  */
export const queryGetLatestBalanceByDate = async (accountId: string, date: number) => {
  const query = `SELECT closingAmount, transactionDateAt FROM ${BALANCE}
                WHERE accountId='${accountId}'
                AND (
                  transactionDateAt < ${date}
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

export const queryGetCurrentBalance = async (accountId: string) => {
  const query = `SELECT closingAmount, transactionDateAt FROM ${BALANCE}
                WHERE accountId='${accountId}'
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

export const queryGetAllBalanceAfterDate = async (accountId: string, date: number) => {
  try {
    const query = `SELECT * FROM ${BALANCE}
                WHERE accountId='${accountId}'
                AND transactionDateAt > ${date}
                ORDER BY transactionDateAt, _id`;
    return await database.read(async () => {
      return await database
        .get<BalanceModel>(BALANCE)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
    });
  } catch (error) {
    return handleError({
      error: 'R-ALL-BAL',
    });
  }
};

/** create */
export const queryAddBalanceFromAccount = async (balance: TBalance) => {
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

export const queryAddNewBalanceTransaction = async (transaction: TransactionModel | any) => {
  try {
    return await database.write(async () => {
      const query = `SELECT MAX(_id) AS maxId from ${BALANCE}`;
      const currentLatestId = await database
        .get<BalanceModel>(BALANCE)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return await database.get<BalanceModel>(BALANCE).create((item) => {
        Object.assign(item, {
          accountId: transaction.accountId,
          transactionId: transaction.id,
          movementAmount: transaction.amount,
          transactionDateAt: transaction.dateTimeAt,
          _id: currentLatestId[0].maxId + 1,
        });
      });
    });
  } catch (error) {
    return handleError({
      error: 'CR-BAL-TRAN',
    });
  }
};

/** update */
export const queryUpdateBalanceTransaction = async (transaction: any, accountIdQuery?: string) => {
  try {
    const query = [Q.where('transactionId', transaction.id)];
    if (accountIdQuery) {
      query.push(Q.where('accountId', accountIdQuery));
    }
    const result = await database.write(async () => {
      const currentBalance = await database
        .get<BalanceModel>(BALANCE)
        .query(...query)
        .fetch();
      if (!isEmpty(currentBalance)) {
        await currentBalance[0].update((bal) => {
          bal.accountId = transaction.accountId;
          bal.movementAmount = transaction.amount;
          bal.transactionDateAt = new Date(transaction.dateTimeAt);
        });
        return true;
      } else {
        return false;
      }
    });
    if (!result) {
      await queryAddNewBalanceTransaction(transaction);
    }
    return true;
  } catch (error) {
    return handleError({
      error: 'UPD-BAL-TRANS',
    });
  }
};

export const queryUpdateBalanceAfterUpdateAccount = ({
  accountData,
}: {
  accountData: TAccount;
}) => {
  try {
    return database.write(async () => {
      const balance = await database
        .get<BalanceModel>(BALANCE)
        .query(Q.and(Q.where('accountId', accountData.id), Q.where('transactionDateAt', null)))
        .fetch();
      if (!isEmpty(balance)) {
        await balance[0].update((bal) => {
          bal.openAmount = accountData.initialAmount;
          bal.closingAmount = accountData.initialAmount;
        });
      }
      return true;
    });
  } catch (error) {
    return handleError({
      error: 'CR-BAL',
    });
  }
};

export const queryCalculateAllBalanceAfterDate = async ({
  accountId,
  date,
}: {
  accountId: string;
  date: number;
}) => {
  try {
    const { closingAmount, transactionDateAt: prevDate } = await queryGetLatestBalanceByDate(
      accountId,
      new Date(date).getTime(),
    );
    const recordUpdate = await queryGetAllBalanceAfterDate(accountId, prevDate || 0);
    if (isEmpty(recordUpdate)) {
      return;
    }
    /** calculate all openAmount and closingAmount base on current amount */
    const newDataUpdate = recordUpdate.map((item, index) => {
      item.openAmount = index ? recordUpdate[index - 1].closingAmount : closingAmount;
      item.closingAmount = item.openAmount + item.movementAmount;
      return item;
    });

    /** generate query by new update data above */
    const updateStatements: SQLiteQuery[] = newDataUpdate.map((record) => {
      const { id, openAmount, closingAmount } = record;
      return [
        `UPDATE ${BALANCE} SET openAmount = ?, closingAmount = ? where id = ?`,
        [openAmount, closingAmount, id],
      ];
    });

    return database.write(async () => {
      await database.adapter.unsafeExecute({
        sqls: updateStatements,
      });
      return true;
    });
  } catch (error) {
    console.log(error);
    return handleError({
      error: 'UPD-BAL-ONE',
    });
  }
};

/** delete */
export const queryDeleteBalanceById = async (id: string, accountId?: string) => {
  try {
    const query = [Q.where('transactionId', id)];
    if (accountId) {
      query.push(Q.where('accountId', accountId));
    }
    return await database.write(async () => {
      await database
        .get<BalanceModel>(BALANCE)
        .query(...query)
        .destroyAllPermanently();
      return true;
    });
  } catch (error) {
    return handleError({
      error: 'DEL-BAL',
    });
  }
};
