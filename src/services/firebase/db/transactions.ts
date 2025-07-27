// src/services/user/Transactions.ts
import { TTransactions } from 'database/types';
import { FB_PATH } from '../config';
import { databaseService } from '../services/database';
import { convertDataToFb } from 'utils/algorithm';
import { FirebaseResponse } from '../types';

export class Transactions {
  private static instance: Transactions;

  private constructor() {}

  public static getInstance(): Transactions {
    if (!Transactions.instance) {
      Transactions.instance = new Transactions();
    }
    return Transactions.instance;
  }

  public async addNewTransaction({
    transaction,
  }: {
    transaction: Partial<TTransactions>;
  }): Promise<FirebaseResponse<void>> {
    const updatedTransaction = convertDataToFb(transaction);
    return await databaseService.set(
      `${FB_PATH.TRANSACTIONS}/${transaction.id}`,
      updatedTransaction,
    );
  }

  public async updateTransaction({
    transaction,
  }: {
    transaction: Partial<TTransactions>;
  }): Promise<FirebaseResponse<void>> {
    const updatedTransaction = convertDataToFb(transaction);
    return await databaseService.update(
      `${FB_PATH.TRANSACTIONS}/${transaction.id}`,
      updatedTransaction,
    );
  }

  public async deleteTransactionById(transactionId: string): Promise<FirebaseResponse<void>> {
    return await databaseService.remove(`${FB_PATH.TRANSACTIONS}/${transactionId}`);
  }

  public async deleteTransactions(ids: string[]): Promise<FirebaseResponse<void>> {
    const pathIdsDelete = ids.map((id) => `${FB_PATH.TRANSACTIONS}/${id}`);
    return await databaseService.removeMultiple(pathIdsDelete);
  }
}

export const transactionsFb = Transactions.getInstance();
