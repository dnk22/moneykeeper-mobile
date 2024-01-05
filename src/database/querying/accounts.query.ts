import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS, BALANCE } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { isEqual } from 'lodash';

export type TGetAllAccounts = {
  isActive?: boolean;
  text?: string;
  excludeId?: string;
};

/** READ */
export const queryAllAccount = async ({ text = '', excludeId = '' }: TGetAllAccounts) => {
  return await database.read(async () => {
    var startTime = performance.now();
    const result = await database
      .get<AccountModel>(ACCOUNTS)
      .query(
        Q.experimentalJoinTables([BALANCE]),
        Q.unsafeSqlQuery(
          `SELECT acc.id, acc.accountName, acc.accountLogo, acc._status, acc.isActive, acc.accountTypeId, acc.accountTypeName, acc.sortOrder, bal.closingAmount FROM ${ACCOUNTS} acc
            LEFT JOIN (
              SELECT
                b._id,
                b.accountId,
                b.closingAmount,
                b.transactionDateAt,
                ROW_NUMBER() OVER (PARTITION BY b.accountId ORDER BY b.transactionDateAt DESC, b._id DESC) AS row_num
              FROM ${BALANCE} b
            ) bal ON bal.accountId = acc.id AND bal.row_num = 1
            WHERE acc._status!='deleted' AND acc.id!='${excludeId}' AND acc.accountName LIKE '${Q.sanitizeLikeString(
            text,
          )}%'`,
        ),
      )
      .unsafeFetchRaw();
    var endTime = performance.now();
    console.log(`get list account: ${(endTime - startTime) / 1000} s`);
    return result;
  });
};

export const queryAccountById = async (id: string, getAll = true) => {
  const query = `SELECT ${
    getAll ? '*' : 'accountLogo, accountName'
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
  try {
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
      };
    });
  } catch (error) {
    return Promise.reject({
      success: false,
      error: 'Có lỗi trong quá trình tạo tài khoản.',
    });
  }
};

/** UPDATE */
export const queryUpdateAccount = async ({ id, account }: { id: string; account: TAccount }) => {
  try {
    return await database.write(async () => {
      const res = await database.get<AccountModel>(ACCOUNTS).find(id);
      const isUpdateBalance =
        !isEqual(account.initialAmount, res.initialAmount) ||
        !isEqual(account.creditCardLimit, res.creditCardLimit);
      await res.update((item) => {
        Object.assign(item, account);
      });
      // check if has new initialAmount, update balance also
      return {
        isUpdateBalance,
        data: res,
      };
    });
  } catch (error) {
    return Promise.reject({
      success: false,
      error: 'Có lỗi trong quá trình cập nhật tài khoản.',
    });
  }
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
export const queryDeleteAccount = async (id: string) => {
  return await database.write(async () => {
    return (await database.get<AccountModel>(ACCOUNTS).find(id)).markAsDeleted();
  });
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await database.get<AccountModel>(ACCOUNTS).query().markAllAsDeleted();
  });
};
