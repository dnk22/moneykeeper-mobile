import { TRANSACTION_CATEGORY_TYPE, TRANSACTION_LEND_BORROW_NAME } from 'utils/constant';
import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { AccountModel, BalanceModel, TransactionModel } from 'database/models';
import { Q } from '@nozbe/watermelondb';
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { ACCOUNT_CATEGORY_ID, TRANSACTION_TYPE } from 'utils/constant';
import { get } from 'lodash';

export const queryGetAllBalance = async () => {
  const query = `SELECT * FROM ${BALANCE}`;
  return await database.read(async () => {
    const res = await database
      .get<TransactionModel>(BALANCE)
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
      WHERE (accountId='${accountId}' OR toAccountId='${accountId}')
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
}: // endDate,
{
  accountId: string;
  // endDate: Date | number;
}) => {
  // const queryDate = endDate
  //   ? `AND transactionDateAt < ${new Date(
  //       new Date(endDate).setUTCHours(23, 59, 59, 999),
  //     ).getTime()}`
  //   : '';
  return await database.read(async () => {
    const result = await database
      .get<BalanceModel>(BALANCE)
      .query(
        Q.unsafeSqlQuery(
          `SELECT closingAmount, MAX(transactionDateAt) FROM ${BALANCE}
            WHERE accountId='${accountId}'`,
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

export const getCurrentBalanceAllAccount = async () => {
  var startTime = performance.now();
  return await database.read(async () => {
    const totalMoneyInAccount = await database
      .get<AccountModel>(ACCOUNTS)
      .query(
        Q.experimentalJoinTables([TRANSACTIONS]),
        Q.unsafeSqlQuery(
          `SELECT acc.id, SUM(bal.closingAmount) AS value FROM ${ACCOUNTS} acc
          LEFT JOIN (
            SELECT
              b._id,
              b.accountId,
              b.closingAmount,
              b.transactionDateAt,
              ROW_NUMBER() OVER (PARTITION BY b.accountId ORDER BY b.transactionDateAt DESC, b._id DESC) AS row_num
            FROM ${BALANCE} b
          ) bal ON bal.accountId = acc.id AND bal.row_num = 1
          WHERE acc._status!='deleted'`,
        ),
      )
      .unsafeFetchRaw();
    const debtLoan = await database
      .get<AccountModel>(ACCOUNTS)
      .query(
        Q.experimentalJoinTables([TRANSACTIONS]),
        Q.unsafeSqlQuery(
          `SELECT 
          SUM(CASE 
              WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.LEND}' THEN amount 
              ELSE 0 
            END) + SUM(CASE 
                          WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}' THEN amount 
                          ELSE 0 
                       END) AS debt,
          SUM(CASE 
              WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.BORROW}' THEN amount 
              ELSE 0 
            END) + SUM(CASE 
                          WHEN transC.categoryName = '${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}' THEN amount 
                          ELSE 0 
                       END) AS loan
        FROM ${TRANSACTIONS} trans
        LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
        WHERE trans._status != 'deleted' AND 
              transC.categoryName IN ('${TRANSACTION_LEND_BORROW_NAME.LEND}','${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}','${TRANSACTION_LEND_BORROW_NAME.BORROW}','${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}')`,
        ),
      )
      .unsafeFetchRaw();
    const moneyAccountRemain = get(totalMoneyInAccount[0], 'value', 0);
    const debtLoanRemain = Math.abs(get(debtLoan[0], 'debt', 0)) - get(debtLoan[0], 'loan', 0);
    var endTime = performance.now();
    console.log(`get financial statement: ${Number((endTime - startTime) / 1000).toFixed(5)} s`);
    return moneyAccountRemain + debtLoanRemain;
  });
};

export const getExpenseIncomeInRangeDate = async (rangeDate: string) => {
  let startDate: Date | number = new Date();
  let endDate: Date | number = new Date();
  switch (rangeDate) {
    case 'now':
      startDate = startDate.setUTCHours(0, 0, 0, 0);
      endDate = endDate.setUTCHours(23, 59, 59, 999);
      break;
    case 'quart':
      startDate = startOfQuarter(startDate).getTime();
      endDate = endOfQuarter(endDate).getTime();
      break;
    case 'year':
      startDate = startOfYear(startDate).getTime();
      endDate = endOfYear(endDate).getTime();
      break;
    default:
      startDate = startOfMonth(startDate).getTime();
      endDate = endOfMonth(endDate).getTime();
      break;
  }
  return await database.read(async () => {
    const totalAmount = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
          SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END) AS expense
          FROM ${TRANSACTIONS}
          WHERE _status!='deleted' AND transactionType != ${TRANSACTION_TYPE.TRANSFER} AND dateTimeAt BETWEEN ${startDate} AND ${endDate}`,
        ),
      )
      .unsafeFetchRaw();

    const categoryGroup = await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT
              COALESCE(tc.parentId, t.categoryId) AS categoryParentId,
              COALESCE(tc_parent.categoryName, 'Uncategorized') AS categoryName,
              SUM(CASE WHEN t.amount < 0 THEN -t.amount ELSE 0 END) AS expense
          FROM
              ${TRANSACTIONS} t
          JOIN
              ${TRANSACTION_CATEGORY} tc ON t.categoryId = tc.id
          LEFT JOIN
              ${TRANSACTION_CATEGORY} tc_parent ON COALESCE(tc.parentId, t.categoryId) = tc_parent.id
          WHERE
              t._status!='deleted' 
              AND t.transactionType != ${TRANSACTION_TYPE.TRANSFER} AND t.transactionType != ${TRANSACTION_TYPE.INCOME}
              AND t.dateTimeAt BETWEEN ${startDate} AND ${endDate}
          GROUP BY
            COALESCE(tc.parentId, t.categoryId) 
          ORDER BY expense DESC`,
        ),
      )
      .unsafeFetchRaw();
    return {
      totalAmount,
      categoryGroup,
    };
  });
};

export const queryAccountStatement = async (isOwnedViewType: boolean) => {
  return await database.read(async () => {
    return await database
      .get<AccountModel>(ACCOUNTS)
      .query(
        Q.experimentalJoinTables([TRANSACTIONS]),
        Q.unsafeSqlQuery(
          `SELECT acc.id, acc.accountName , acc.accountLogo AS logo, acc.isActive, acc.accountTypeName, acc.accountTypeId, acc.sortOrder, bal.closingAmount AS value FROM ${ACCOUNTS} acc
          LEFT JOIN (
            SELECT
              b._id,
              b.accountId,
              b.closingAmount,
              b.transactionDateAt,
              ROW_NUMBER() OVER (PARTITION BY b.accountId ORDER BY b.transactionDateAt DESC, b._id DESC) AS row_num
            FROM ${BALANCE} b
          ) bal ON bal.accountId = acc.id AND bal.row_num = 1
          WHERE acc._status!='deleted' AND acc.accountTypeId ${isOwnedViewType ? '!=' : '='} ${
            ACCOUNT_CATEGORY_ID.CREDITCARD
          }`,
        ),
      )
      .unsafeFetchRaw();
  });
};
export const queryGetDebtLoanStatement = async (isOwnedViewType: boolean) => {
  const categoryName = isOwnedViewType
    ? `'${TRANSACTION_LEND_BORROW_NAME.LEND}','${TRANSACTION_LEND_BORROW_NAME.COLLECT_DEBTS}'`
    : `'${TRANSACTION_LEND_BORROW_NAME.BORROW}','${TRANSACTION_LEND_BORROW_NAME.REPAYMENT}'`;
  return await database.read(async () => {
    return await database
      .get<TransactionModel>(TRANSACTIONS)
      .query(
        Q.unsafeSqlQuery(
          `SELECT trans.id, trans.relatedPerson, transC.categoryType, SUM(trans.amount) AS value, transC.categoryName FROM ${TRANSACTIONS} trans
          LEFT JOIN ${TRANSACTION_CATEGORY} transC ON transC.id = trans.categoryId
          WHERE trans._status!='deleted' AND transC.categoryName IN (${categoryName}) GROUP BY trans.relatedPerson`,
        ),
      )
      .unsafeFetchRaw();
  });
};
