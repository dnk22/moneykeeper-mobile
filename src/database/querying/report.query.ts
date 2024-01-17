import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { AccountModel, BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';
import TransactionCategoryModel from 'database/models/transactionCategory.model';

export const queryGetAllBalance = async () => {
  const query = `SELECT * FROM ${ACCOUNTS}`;
  return await database.read(async () => {
    const res = await database
      .get<AccountModel>(ACCOUNTS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    console.log(res);
    return res;
  });
};

export const queryGetSummaryAccountById = async ({ accountId }: { accountId: string }) => {
  return await database.read(async () => {
    const result = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT 
          SUM(CASE 
              WHEN amount > 0 THEN amount 
              ELSE 0 
          END) 
          + SUM(CASE 
              WHEN amount < 0 AND toAccountId = '${accountId}' THEN toAmount 
              ELSE 0 
          END) AS totalIncome,
          SUM(CASE 
              WHEN amount < 0 AND accountId = '${accountId}' THEN amount 
              ELSE 0 
          END) AS totalExpense 
      FROM ${TRANSACTIONS}
      WHERE accountId='${accountId}' OR toAccountId='${accountId}'
          AND _status!='deleted' 
          AND excludeReport=0`,
        ),
      )
      .unsafeFetchRaw();
    return result.length && result[0];
  });
};

export const queryGetCurrentBalanceCreditCardByAccountId = async ({
  accountId,
  endDate,
  getAll,
}: {
  accountId: string;
  endDate?: Date | number;
  getAll: boolean;
}) => {
  if (!endDate) {
    return 0;
  }
  const queryDate = !getAll
    ? `AND transactionDateAt < ${new Date(
        new Date(endDate).setUTCHours(23, 59, 59, 999),
      ).getTime()}`
    : '';
  return await database.read(async () => {
    const result = await database
      .get<BalanceModel>(BALANCE)
      .query(
        Q.unsafeSqlQuery(
          `SELECT closingAmount, MAX(transactionDateAt) FROM ${BALANCE}
            WHERE accountId='${accountId}' ${queryDate}`,
        ),
      )
      .unsafeFetchRaw();
    return result.length && result[0].closingAmount;
  });
};

export const queryGetPaymentDueCreditCardByAccountId = async ({
  accountId,
  startDate,
  endDate,
}: {
  accountId: string;
  startDate: number | Date;
  endDate: number | Date;
}) => {
  if (!startDate || !endDate) {
    return 0;
  }
  const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)).getTime();
  const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)).getTime();
  return await database.read(async () => {
    const result = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT 
          SUM(CASE 
              WHEN amount < 0 AND accountId = '${accountId}' THEN amount 
              ELSE 0 
          END) AS totalExpense 
      FROM ${TRANSACTIONS}
      WHERE (accountId='${accountId}' OR toAccountId='${accountId}') AND dateTimeAt BETWEEN ${startOfDay} AND ${endOfDay}
          AND _status!='deleted' 
          AND excludeReport=0`,
        ),
      )
      .unsafeFetchRaw();
    return result.length && result[0].totalExpense;
  });
};

export const queryGetAllStatement = async ({ accountId }: { accountId: string }) => {
  return await database.read(async () => {
    const result = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT DISTINCT strftime('%Y-%m-%d', datetime(dateTimeAt/1000, 'unixepoch')) AS date
          FROM ${TRANSACTIONS} WHERE accountId='${accountId}'
          ORDER BY month DESC;`,
        ),
      )
      .unsafeFetchRaw();
    return result;
  });
};
