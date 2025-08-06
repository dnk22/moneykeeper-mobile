import { TBank, TTransactionsCategory } from 'database/types';
import { TSettings } from 'utils/types/store.type';

export interface InitializerOptions {
  dataSource?: any;
}

export interface TInitializer {
  initialize(): Promise<void>;
}

export interface InitializerDataSource {
  getCategories(): Promise<TTransactionsCategory[]>;
  getBanks(): Promise<TBank[]>;
  getAppSettings(): Promise<TSettings>;
}
