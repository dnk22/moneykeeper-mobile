import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS, BALANCE } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';

export type TGetAllAccounts = {
  isActive?: boolean;
  text?: string;
  excludeId?: string;
};

/** OBSERVE  */
export const getAccountCountObserve = (isActive: boolean) =>
  database.get<AccountModel>(ACCOUNTS).query(Q.where('isActive', isActive)).observeCount();

/** READ */
export const queryAllAccount = ({ isActive = '', text = '', excludeId = '' }: TGetAllAccounts) =>
  database
    .get<AccountModel>(ACCOUNTS)
    .query(
      Q.experimentalJoinTables([BALANCE]),
      Q.unsafeSqlQuery(
        `SELECT acc.*, bal.closingAmount FROM ${ACCOUNTS} acc
          LEFT JOIN (
            SELECT
              bal2.*,
              MAX(bal2.transactionDateAt)
            FROM
              ${BALANCE} bal2
            GROUP BY
              bal2.accountId
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

export const getFirstAccount = async () => {
  try {
    return await database.read(async () => {
      return await database
        .get<AccountModel>(ACCOUNTS)
        .query(Q.where('_status', Q.notEq('deleted')), Q.where('isActive', true), Q.take(1))
        .fetch();
    });
  } catch (error) {
    console.log(error, 'read first account err');
  }
};

/** CREATE */
export const queryAddAccount = async (account: TAccount) => {
  try {
    return await database.write(async () => {
      const accountDB = database.get<AccountModel>(ACCOUNTS).create((item) => {
        Object.assign(item, account);
      });
      return accountDB;
    });
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/** UPDATE */

export const queryUpdateAccount = async ({ id, account }: { id: string; account: TAccount }) => {
  return await database.write(async () => {
    const res = await database.get<AccountModel>(ACCOUNTS).find(id);
    await res.update((item) => {
      Object.assign(item, account);
    });
  });
};

export const changeAccountStatusById = async ({ id }: { id: string }) => {
  try {
    await database.write(async () => {
      const account = await database.get<AccountModel>(ACCOUNTS).find(id);
      account.update(() => {
        account.isActive = !account.isActive;
      });
    });
  } catch (error) {
    console.log(error, 'change status err');
  }
};

/** DELETE */

export const deleteAccount = async (id: string) => {
  try {
    await database.write(async () => {
      (await database.get<AccountModel>(ACCOUNTS).find(id)).markAsDeleted();
    });
  } catch (error) {
    console.log(error, 'delete err');
  }
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await database.get<AccountModel>(ACCOUNTS).query().markAllAsDeleted();
  });
};
