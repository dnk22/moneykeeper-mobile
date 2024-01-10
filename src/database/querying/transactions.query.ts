import { database } from 'database/index';
import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import { isEqual } from 'lodash';
import { handleError } from 'utils/axios';

export type GetTransactionByDate = {
  date: string;
  accountId: string;
};

/** read */
/** query list transaction group by date  */
export const queryTransactionLisGroupByDate = async (accountId: string) => {
  const query = `SELECT DISTINCT 
      strftime('%Y-%m-%d', datetime(dateTimeAt/1000, 'unixepoch')) AS date 
      FROM ${TRANSACTIONS}
      WHERE _status != 'deleted' AND ((accountId='${accountId}') OR (toAccountId='${accountId}'))
      ORDER BY dateTimeAt DESC 
    `;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
  });
};

/** query list transaction group by month  */
export const queryGetTransactionsListByMonth = async ({
  accountId,
  startDate,
  endDate,
  getAll,
}: {
  accountId: string;
  startDate: Date;
  endDate: Date;
  getAll: boolean | string;
}) => {
  const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)).getTime();
  const dateQuery = getAll ? `AND tran.dateTimeAt BETWEEN ${startOfDay} AND ${endOfDay}` : '';
  const query = `SELECT tran.id, tran.accountId, tran.toAccountId, tran.categoryId,tran.transactionType, tran.descriptions, tran.dateTimeAt, bal._id, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName, bal.closingAmount AS closingAmount,bal.movementAMount AS amount,
      CASE
        WHEN tran.accountId = '${accountId}' THEN accTo.accountName
        WHEN tran.toAccountId = '${accountId}' THEN acc.accountName
      END AS accountName
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      LEFT JOIN ${BALANCE} bal ON bal.transactionId=tran.id AND bal.accountId='${accountId}'
      LEFT JOIN ${ACCOUNTS} acc ON acc.id=tran.accountId
      LEFT JOIN ${ACCOUNTS} accTo ON accTo.id=tran.toAccountId
      WHERE tran._status != 'deleted' AND ((tran.accountId='${accountId}') OR (tran.toAccountId='${accountId}')) ${dateQuery}
      ORDER BY tran.dateTimeAt DESC, bal._id DESC
    `;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
  });
};

export const queryGetTransactionsListByDate = async ({ date, accountId }: GetTransactionByDate) => {
  const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();
  const query = `SELECT tran.id, tran.accountId, tran.toAccountId, tran.categoryId,tran.transactionType, tran.descriptions, tran.dateTimeAt, bal._id, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName, bal.closingAmount AS closingAmount,bal.movementAMount AS amount,
      CASE
        WHEN tran.accountId = '${accountId}' THEN accTo.accountName
        WHEN tran.toAccountId = '${accountId}' THEN acc.accountName
      END AS accountName
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      LEFT JOIN ${BALANCE} bal ON bal.transactionId=tran.id AND bal.accountId='${accountId}'
      LEFT JOIN ${ACCOUNTS} acc ON acc.id=tran.accountId
      LEFT JOIN ${ACCOUNTS} accTo ON accTo.id=tran.toAccountId
      WHERE tran._status != 'deleted' AND ((tran.accountId='${accountId}') OR (tran.toAccountId='${accountId}')) AND tran.dateTimeAt BETWEEN ${startOfDay} AND ${endOfDay}
      ORDER BY tran.dateTimeAt DESC, bal._id DESC
    `;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
  });
};

export const queryTransactionById = async (id: string) => {
  const query = `select * from ${TRANSACTIONS} where id='${id}' and _status != 'deleted'`;
  return await database.read(async () => {
    const res = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    return res[0] || {};
  });
};

/** create */
/**
 *
 * @param transaction : TTransactions
 * add new transaction , if success then update useCount in transaction category
 */
export const queryAddNewTransaction = async (transaction: TTransactions) => {
  return await database.write(async () => {
    return await database.get<TransactionModel>(TRANSACTIONS).create((item) => {
      Object.assign(item, transaction);
    });
  });
};
/** update */
/**
 *
 * @param id
 * @param data
 * @returns void
 *
 * update transaction by id , if update successfully then update useCount in transaction category
 *
 */
export const queryUpdateTransaction = async ({ id, data }: { id: string; data: TTransactions }) => {
  try {
    let isUpdateCountCategory = false;
    let isUpdateBalance = false;
    let prevAccountId = '';
    let prevToAccountId = '';
    let prevDate = data.dateTimeAt;

    return await database.write(async () => {
      const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);

      /** get data for  */
      isUpdateCountCategory = res.categoryId !== data.categoryId;
      isUpdateBalance =
        !isEqual(res.amount, data.amount) ||
        !isEqual(new Date(res.dateTimeAt).getTime(), data.dateTimeAt) ||
        !isEqual(res.accountId, data.accountId) ||
        !isEqual(res.toAccountId, data.toAccountId);
      prevAccountId = res.accountId;
      prevToAccountId = res.toAccountId;
      if (new Date(res.dateTimeAt).getTime() < new Date(prevDate).getTime()) {
        prevDate = new Date(res.dateTimeAt).getTime();
      }

      /** update data */
      await res.update((item) => {
        Object.assign(item, data);
      });

      return {
        isUpdateCountCategory,
        isUpdateBalance,
        prevAccountId,
        prevToAccountId,
        prevDate,
        transactionUpdated: res,
      };
    });
  } catch (error) {
    return handleError({
      error: 'UPD-TRANS',
    });
  }
};
/** delete */
export const queryDeleteTransactionById = async (id: string) => {
  try {
    return await database.write(async () => {
      const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);
      await res.markAsDeleted();
      return res;
    });
  } catch (error) {
    return handleError({
      error: 'DEL-TRANS',
    });
  }
};
