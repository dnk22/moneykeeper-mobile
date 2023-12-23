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

/** OBSERVE  */
export const getAccountCountObserve = (isActive: boolean) =>
  database.get<AccountModel>(ACCOUNTS).query(Q.where('isActive', isActive)).observeCount();

/** READ */
export const queryAllAccount = ({ text = '', excludeId = '' }: TGetAllAccounts) =>
  database
    .get<AccountModel>(ACCOUNTS)
    .query(
      Q.experimentalJoinTables([BALANCE]),
      Q.unsafeSqlQuery(
        `SELECT acc.*, bal.closingAmount FROM ${ACCOUNTS} acc
          LEFT JOIN (
            SELECT
              accountId,
              closingAmount,
              MAX(bal2.transactionDateAt)
            FROM
            ${BALANCE} bal2
            GROUP BY bal2.accountId
          ) bal ON bal.accountId = acc.id
          WHERE acc._status!='deleted' AND acc.id!='${excludeId}' AND acc.accountName LIKE '%${Q.sanitizeLikeString(
          text,
        )}%'`,
      ),
    )
    .unsafeFetchRaw();

export const getAccounts = async ({
  isActive = true,
  text = '',
  excludeId = '',
}: TGetAllAccounts) => {
  try {
    return await database.read(async () => {
      return await database
        .get<AccountModel>(ACCOUNTS)
        .query(
          Q.where('_status', Q.notEq('deleted')),
          Q.where('isActive', isActive),
          Q.where('accountName', Q.like(`%${Q.sanitizeLikeString(text)}%`)),
          Q.where('id', Q.notEq(excludeId || '')),
        )
        .fetch();
    });
  } catch (error) {
    console.log(error, 'read accounts err');
  }
};

export const queryAccountById = async (id: string) => {
  try {
    const query = `select * from ${ACCOUNTS} where id='${id}' and _status != 'deleted' `;
    return await database.read(async () => {
      const res = await database
        .get<AccountModel>(ACCOUNTS)
        .query(Q.unsafeSqlQuery(query))
        .unsafeFetchRaw();
      return res[0] || {};
    });
  } catch (error) {
    console.log(error, 'read by id err');
    return null;
  }
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
    return await database.write(async () => {
      const accountDB = await database.get<AccountModel>(ACCOUNTS).create((item) => {
        Object.assign(item, account);
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
