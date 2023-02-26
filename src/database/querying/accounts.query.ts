import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS } from 'database/constants';
import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';

const accountsTable = database.get<AccountModel>(ACCOUNTS);

export const observeAccountsTable = () => accountsTable.query().observe();

export const addAccount = async (account: TAccount) => {
  await database.write(async () => {
    const post = accountsTable.create((item) => {
      Object.assign(item, account);
    });
    return post;
  });
};

export const getAllActiveAccount = async ({ isActive = true }: { isActive: boolean }) => {
  return await database.read(async () => {
    return await accountsTable.query(Q.where('is_active', isActive)).fetch();
  });
};

export const deleteAllAccount = async () => {
  await database.write(async () => {
    await accountsTable.query().destroyAllPermanently();
  });
};
