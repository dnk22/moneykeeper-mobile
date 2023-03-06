import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';

const accountsTable = database.get<AccountModel>(ACCOUNTS);

export const observeAllActiveAccountsTable = (isActive: boolean) =>
  accountsTable.query(Q.where('is_active', isActive)).observe();

export const getAccountById = async (id: string) => {
  try {
    return await database.read(async () => {
      return await accountsTable.find(id);
    });
  } catch (error) {
    console.log(error, 'read by id err');
  }
};

export const getAccounts = async ({ isActive = true }: { isActive: boolean }) => {
  try {
    return await database.read(async () => {
      return await accountsTable.query(Q.where('is_active', isActive)).fetch();
    });
  } catch (error) {
    console.log(error, 'read err');
  }
};

export const addAccount = async (account: TAccount) => {
  try {
    await database.write(async () => {
      const post = accountsTable.create((item) => {
        Object.assign(item, account);
      });
      return post;
    });
  } catch (error) {
    console.log(error, 'add err');
  }
};

export const updateAccount = async ({ id, account }: { id: string; account: TAccount }) => {
  try {
    await database.write(async () => {
      const res = await accountsTable.find(id);
      await res.update((item) => {
        Object.assign(item, account);
      });
    });
  } catch (error) {
    console.log(error, 'update err');
  }
};

export const deleteAccountById = async ({ id }: { id: string }) => {
  try {
    await database.write(async () => {
      await accountsTable.query(Q.where('id', id)).destroyAllPermanently();
    });
  } catch (error) {
    console.log(error, 'delete err');
  }
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await accountsTable.query().destroyAllPermanently();
  });
};

export const changeAccountStatusById = async ({ id }: { id: string }) => {
  try {
    await database.write(async () => {
      const account = await accountsTable.find(id);
      account.update(() => {
        account.isActive = !account.isActive;
      });
    });
  } catch (error) {
    console.log(error, 'change status err');
  }
};
