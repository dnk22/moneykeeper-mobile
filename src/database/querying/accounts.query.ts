import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';

export type TGetAccounts = {
  isActive?: boolean;
  text: string;
};

/** OBSERVE  */
export const getActiveAccountObserve = (isActive: boolean) =>
  database
    .get<AccountModel>(ACCOUNTS)
    .query(Q.and(Q.where('_status', Q.notEq('deleted')), Q.where('isActive', isActive)))
    .observe();

export const getAccountCountObserve = (isActive: boolean) =>
  database.get<AccountModel>(ACCOUNTS).query(Q.where('isActive', isActive)).observeCount();

/** READ */
export const getAccounts = async ({ isActive = true, text = '' }: TGetAccounts) => {
  try {
    return await database.read(async () => {
      return await database
        .get<AccountModel>(ACCOUNTS)
        .query(
          Q.where('_status', Q.notEq('deleted')),
          Q.where('isActive', isActive),
          Q.where('accountName', Q.like(`%${Q.sanitizeLikeString(text)}%`)),
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

export const addAccount = async (account: TAccount) => {
  try {
    await database.write(async () => {
      const post = database.get<AccountModel>(ACCOUNTS).create((item) => {
        Object.assign(item, account);
      });
      return post;
    });
  } catch (error) {
    console.log(error, 'add err');
  }
};

/** UPDATE */

export const updateAccount = async ({ id, account }: { id: string; account: TAccount }) => {
  try {
    await database.write(async () => {
      const res = await database.get<AccountModel>(ACCOUNTS).find(id);
      await res.update((item) => {
        Object.assign(item, account);
      });
    });
  } catch (error) {
    console.log(error, 'update err');
  }
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
