import { TAccount, TBank, TTransactions, TTransactionsCategory } from 'database/types';
import { InitializerDataSource } from 'services/initialization/types';
import { databaseService } from './services/database';
import { FB_PATH } from './config';
import { TSettings } from 'utils/types/store.type';
import defaultSettings from 'utils/constants/appSettings';

export class FirebaseDataSource implements InitializerDataSource {
  async getCategories(): Promise<TTransactionsCategory[]> {
    const snapshot = await databaseService.getDefaultPath<TTransactionsCategory[]>(
      FB_PATH.DEFAULT_DATA_CATEGORIES,
    );
    return snapshot.data ?? [];
  }

  async getBanks(): Promise<TBank[]> {
    const bankDefault = await databaseService.getDefaultPath<TBank[]>(FB_PATH.DEFAULT_DATA_BANKS);
    const banksOfUser = await databaseService.get<TBank[]>(FB_PATH.BANKS);
    return [...(banksOfUser?.data || []), ...(bankDefault?.data || [])] as TBank[];
  }

  async getAppSettings(): Promise<TSettings> {
    const snapshot = await databaseService.get<TSettings>(FB_PATH.SETTINGS);
    return snapshot.data ?? (defaultSettings as TSettings);
  }

  async getAccountData(): Promise<{ accounts: TAccount[]; transactions: TTransactions[] }> {
    const accountsSnapshot = await databaseService.get<TAccount[]>(FB_PATH.ACCOUNTS);
    const transactionsSnapshot = await databaseService.get<TTransactions[]>(FB_PATH.TRANSACTIONS);

    return {
      accounts: Object.values(accountsSnapshot?.data ?? {}),
      transactions: Object.values(transactionsSnapshot?.data ?? {}),
    };
  }
}
