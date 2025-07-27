// src/services/user/Accounts.ts
import { TAccount } from 'database/types';
import { FB_PATH } from '../config';
import { FirebaseResponse } from '../types';
import { databaseService } from '../services/database';
import { convertDataToFb } from 'utils/algorithm';

export class Accounts {
  private static instance: Accounts;

  private constructor() {}

  public static getInstance(): Accounts {
    if (!Accounts.instance) {
      Accounts.instance = new Accounts();
    }
    return Accounts.instance;
  }

  public async addNewAccount({
    account,
  }: {
    account: Partial<TAccount>;
  }): Promise<FirebaseResponse<void>> {
    const updatedAccount = convertDataToFb(account);
    return await databaseService.set(`${FB_PATH.ACCOUNTS}/${account.id}`, updatedAccount);
  }

  public async updateAccount({
    account,
  }: {
    account: Partial<TAccount>;
  }): Promise<FirebaseResponse<void>> {
    const updatedAccount = convertDataToFb(account);
    return await databaseService.update(`${FB_PATH.ACCOUNTS}/${account.id}`, updatedAccount);
  }

  public async deleteAccountById(accountId: string): Promise<FirebaseResponse<void>> {
    return await databaseService.remove(`${FB_PATH.ACCOUNTS}/${accountId}`);
  }
}

export const accountsFb = Accounts.getInstance();
