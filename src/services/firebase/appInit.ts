import { TBank, TTransactionsCategory } from 'database/types';
import { InitializerDataSource } from 'services/initialization/types';
import { databaseService } from './services/database';

export class FirebaseDataSource implements InitializerDataSource {
  async getCategories(): Promise<TTransactionsCategory[]> {
    const snapshot = await databaseService.get<TTransactionsCategory[]>('/default_data/categories');
    return snapshot.data ?? [];
  }

  async getBanks(): Promise<TBank[]> {
    const snapshot = await databaseService.get<TBank[]>('/default_data/banks');
    return snapshot.data ?? [];
  }
}
