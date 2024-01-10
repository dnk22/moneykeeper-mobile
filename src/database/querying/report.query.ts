import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { AccountModel, BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';
import TransactionCategoryModel from 'database/models/transactionCategory.model';

export const queryGetAllBalance = async () => {
  const query = `SELECT * FROM ${TRANSACTIONS}`;
  return await database.read(async () => {
    const res = await database
      .get<TransactionModel>(TRANSACTIONS)
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

export const queryGetSummaryCreditCardAccountById = async ({
  accountId,
}: {
  accountId: string;
}) => {
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
      WHERE (accountId='${accountId}' OR toAccountId='${accountId}')
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
          `SELECT DISTINCT strftime('%Y-%m', datetime(dateTimeAt/1000, 'unixepoch')) AS month
          FROM ${TRANSACTIONS} WHERE accountId='${accountId}'
          ORDER BY month DESC;`,
        ),
      )
      .unsafeFetchRaw();
    return result;
  });
};
