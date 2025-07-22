import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS, BALANCE } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import isEqual from 'lodash/isEqual';

export type TGetAllAccounts = {
  isInActive?: boolean;
  text?: string;
  excludeId?: string;
};

export const queryAccounts = async ({
  text = '',
  excludeId = '',
  isInActive = false,
}: TGetAllAccounts = {}) => {
  // WHERE conditions
  const whereConditions = [
    "acc._status!='deleted'",
    excludeId ? `acc.id!='${excludeId}'` : null,
    text ? `acc.accountName LIKE '${Q.sanitizeLikeString(text)}%'` : null,
    isInActive && `acc.isActive=${!isInActive}`,
  ]
    .filter(Boolean)
    .join(' AND ');

  return await database.read(async () => {
    const startTime = performance.now();
    const result = await database
      .get<AccountModel>(ACCOUNTS)
      .query(
        Q.experimentalJoinTables([BALANCE]),
        Q.unsafeSqlQuery(
          `WITH LatestBalance AS (
              SELECT b._id, b.accountId, b.closingAmount, b.transactionDateAt
              FROM ${BALANCE} b
              WHERE b._id = (
                  SELECT _id FROM ${BALANCE}
                  WHERE accountId = b.accountId
                  ORDER BY transactionDateAt DESC, _id DESC 
                  LIMIT 1
              )
          )
          SELECT 
              acc.id, 
              acc.accountName, 
              acc.accountLogo, 
              acc._status, 
              acc.isActive, 
              acc.accountTypeId, 
              acc.sortOrder, 
              bal.closingAmount 
          FROM ${ACCOUNTS} acc
          LEFT JOIN LatestBalance bal ON bal.accountId = acc.id
          WHERE ${whereConditions}
          ORDER BY acc.sortOrder ASC`,
        ),
      )
      .unsafeFetchRaw();

    const endTime = performance.now();
    console.log(`get list account: ${((endTime - startTime) / 1000).toFixed(5)} s`);
    return result;
  });
};

export const queryAccountById = async (id: string, fields: string[] = []) => {
  const query = `SELECT ${
    fields.length ? String(fields) : '*'
  }  FROM ${ACCOUNTS} WHERE id='${id}' AND _status != 'deleted' `;
  return await database.read(async () => {
    const res = await database
      .get<AccountModel>(ACCOUNTS)
      .query(Q.unsafeSqlQuery(query))
      .unsafeFetchRaw();
    return res[0] || {};
  });
};

export const queryGetFirstAccount = async () => {
  return await database.read(async () => {
    return await database
      .get<AccountModel>(ACCOUNTS)
      .query(Q.where('_status', Q.notEq('deleted')), Q.where('isActive', true), Q.take(1))
      .fetch();
  });
};

/** CREATE */
export const queryAddAccount = async (account: TAccount) => {
  const queryGetMaxSortOrder = `SELECT MAX(sortOrder) AS currentSortOrder from ${ACCOUNTS} WHERE _status!='deleted'`;
  return await database.write(async () => {
    const result = await database
      .get<AccountModel>(ACCOUNTS)
      .query(Q.unsafeSqlQuery(queryGetMaxSortOrder))
      .unsafeFetchRaw();
    const accountDB = await database.get<AccountModel>(ACCOUNTS).create((item) => {
      Object.assign(item, { ...account, sortOrder: result[0].currentSortOrder + 1 });
    });
    return {
      accountId: accountDB.id,
      openAmount: accountDB?.initialAmount,
      closingAmount: accountDB?.initialAmount,
      transactionDateAt: null,
      accountTypeId: accountDB.accountTypeId,
    };
  });
};

/** UPDATE */
export const queryUpdateAccount = async ({
  id,
  account,
}: {
  id: string;
  account: TAccount;
}): Promise<{ isUpdateBalance: boolean; data: TAccount }> => {
  return await database.write(async () => {
    const res = await database.get<AccountModel>(ACCOUNTS).find(id);
    // update balance table : prev initialAmount != new initialAmount
    const isUpdateBalance = !isEqual(account.initialAmount, res.initialAmount);

    await res.update((item) => {
      Object.assign(item, account);
    });
    // check if has new initialAmount, update balance also
    return {
      isUpdateBalance,
      data: res,
    };
  });
};

export const queryChangeAccountStatusById = async (id: string) => {
  try {
    await database.write(async () => {
      const account = await database.get<AccountModel>(ACCOUNTS).find(id);
      account.update(() => {
        account.isActive = !account.isActive;
      });
    });
  } catch (error) {
    return Promise.reject({
      success: false,
      error: 'Có lỗi trong quá trình cập nhật tài khoản.',
    });
  }
};

/** DELETE */
export const queryDeleteAccountById = async (accountId: string) => {
  try {
    return await database.write(async () => {
      return (await database.get<AccountModel>(ACCOUNTS).find(accountId)).markAsDeleted();
    });
  } catch (error) {
    console.log(error);
    return Promise.reject({
      success: false,
      error: 'Có lỗi trong quá trình xóa tài khoản.',
    });
  }
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await database.get<AccountModel>(ACCOUNTS).query().markAllAsDeleted();
  });
};
