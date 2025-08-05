import { TBank, TTransactionsCategory } from 'database/types';

export interface InitializerOptions {
  dataSource?: any;
}

export interface TInitializer {
  initialize(): Promise<void>;
}

export interface InitializerDataSource {
  getCategories(): Promise<TTransactionsCategory[]>;
  getBanks(): Promise<TBank[]>;
}
