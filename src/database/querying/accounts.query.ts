import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';

/** OBSERVE  */
export const getActiveAccountObserve = (isActive: boolean) =>
  database.get<AccountModel>(ACCOUNTS).query(Q.where('is_active', isActive)).observe();

export const getAccountCountObserve = (isActive: boolean) =>
  database.get<AccountModel>(ACCOUNTS).query(Q.where('is_active', isActive)).observeCount();

/** READ */
export const getAccounts = async ({
  isActive = true,
  text = '',
}: {
  isActive?: boolean;
  text: string;
}) => {
  try {
    return await database.read(async () => {
      return await database
        .get<AccountModel>(ACCOUNTS)
        .query(
          Q.where('is_active', isActive),
          Q.where('account_name', Q.like(`${Q.sanitizeLikeString(text)}%`)),
        )
        .fetch();
    });
  } catch (error) {
    console.log(error, 'read accounts err');
  }
};

export const getAccountById = async (id: string) => {
  try {
    return await database.read(async () => {
      return await database.get<AccountModel>(ACCOUNTS).find(id);
    });
  } catch (error) {
    console.log(error, 'read by id err');
  }
};

export const getFirstAccount = async () => {
  try {
    return await database.read(async () => {
      return await database
        .get<AccountModel>(ACCOUNTS)
        .query(Q.where('is_active', true), Q.take(1))
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

export const deleteAccountById = async ({ id }: { id: string }) => {
  try {
    await database.write(async () => {
      await database.get<AccountModel>(ACCOUNTS).query(Q.where('id', id)).destroyAllPermanently();
    });
  } catch (error) {
    console.log(error, 'delete err');
  }
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await database.get<AccountModel>(ACCOUNTS).query().destroyAllPermanently();
  });
};
