import { TAccount, TBalance, TTransactions } from 'database/types';
import { database } from 'database/index';
import { BalanceModel, TransactionModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import { isEmpty, size } from 'lodash';
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
export const queryUpdateBalanceTransaction = async (
  transaction: TTransactions,
  prevAccount?: string,
) => {
  try {
    const query = [Q.where('transactionId', transaction.id)];
    if (prevAccount) {
      query.push(Q.where('accountId', prevAccount));
    }
    return await database.write(async () => {
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
      }
      return currentBalance[0];
    });
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
      date,
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
      // for (const balance of newDataUpdate) {
      //   const res = await database.get<BalanceModel>(BALANCE).find(balance.id);
      //   // delete balance.id;
      //   // delete balance._id;
      //   await res.update((item) => {
      //     // Object.assign(item, balance);
      //     item.openAmount = balance.openAmount;
      //     item.closingAmount = balance.closingAmount;
      //   });
      // }
      await database.adapter.unsafeExecute({
        sqls: updateStatements,
      });
      return true;
    });
  } catch (error) {
    return handleError({
      error: 'UPD-BAL-ONE',
    });
  }
};

/** delete */
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

export const queryDeleteBalanceById = async (id: string) => {
  try {
    return await database.write(async () => {
      const res = await database
        .get<BalanceModel>(BALANCE)
        .query(Q.where('transactionId', id))
        .fetch();
      for await (const item of res) {
        await item.destroyPermanently();
      }
      return true;
    });
  } catch (error) {
    return handleError({
      error: 'DEL-BAL',
    });
  }
};
