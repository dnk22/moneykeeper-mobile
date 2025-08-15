import { database } from 'database/index';
import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { BalanceModel, TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import isEqual from 'lodash/isEqual';
import { TRANSACTION_TYPE } from 'utils/constants';

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
    let prevDate = data.recordAt;

    return await database.write(async () => {
      const res = await database.get<TransactionModel>(TRANSACTIONS).find(id);

      /** get data for  */
      isUpdateCountCategory = res.categoryId !== data.categoryId;
      isUpdateBalance =
        !isEqual(res.amount, data.amount) ||
        !isEqual(new Date(res.recordAt).getTime(), data.recordAt) ||
        !isEqual(res.accountId, data.accountId) ||
        !isEqual(res.toAccountId, data.toAccountId);
      prevAccountId = res.accountId;
      prevToAccountId = res.toAccountId;
      if (new Date(res.recordAt).getTime() < new Date(prevDate).getTime()) {
        prevDate = new Date(res.recordAt).getTime();
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

export const queryDeleteAllTransactionRelatedWithAccountId = async (accountId: string) => {
  try {
    let accountReCalculateBalance: { accountId: string; recordAt: number }[] = [];
    await database.write(async () => {
      const transferTransaction = await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(
          Q.unsafeSqlQuery(`SELECT id FROM ${TRANSACTIONS} 
        WHERE transactionType=${TRANSACTION_TYPE.TRANSFER} AND _status!='deleted' AND (toAccountId='${accountId}' OR accountId='${accountId}')`),
        )
        .unsafeFetchRaw();

      // re-calculate balance in related account
      accountReCalculateBalance = await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(
          Q.unsafeSqlQuery(`SELECT accountId, recordAt FROM ${TRANSACTIONS} 
      WHERE (toAccountId='${accountId}' OR accountId='${accountId}') GROUP BY accountId HAVING MIN(recordAt)`),
        )
        .unsafeFetchRaw();

      // delete balance related
      if (transferTransaction && transferTransaction.length) {
        await database
          .get<BalanceModel>(BALANCE)
          .query(
            Q.where(
              'transactionId',
              Q.oneOf(Array.from(transferTransaction.map((item) => item.id))),
            ),
          )
          .destroyAllPermanently();
      }

      // delete transaction related
      await database
        .get<TransactionModel>(TRANSACTIONS)
        .query(Q.where('toAccountId', Q.eq(accountId)))
        .destroyAllPermanently();
    });
    return accountReCalculateBalance;
  } catch (error) {
    console.log(error, 'error');
    return handleError({
      error: 'DEL-ALL-REL',
    });
  }
};
