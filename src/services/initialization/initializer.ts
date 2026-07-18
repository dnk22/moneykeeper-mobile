import { TInitializer, InitializerOptions, InitializerDataSource } from './types';
import { ACCOUNTS, BANKS, TRANSACTION_CATEGORY, TRANSACTIONS } from 'database/constants';
import { database } from 'database/index';
import { AccountModel, BankModel, TransactionModel, CategoriesModel } from 'database/models';
import { balanceLocalQuery } from 'database/querying';
import { TAccount, TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import size from 'lodash/size';
import { storageService } from 'services/storage';
import { MMKV_KEY } from 'services/storage/const';
import { TRANSACTION_LEND_BORROW_NAME } from 'utils/constants';

export class Initializer implements TInitializer {
  private dataSource: InitializerDataSource;

  constructor(options: InitializerOptions) {
    this.dataSource = options.dataSource;
  }

  async initialize(): Promise<void> {
    await this.bankInitialize();
    await this.categoriesInitialize();
    await this.accountDataInitialize();
  }

  private uniqueById<T extends { id: string }>(items: T[]): T[] {
    return Array.from(
      new Map(items.filter((item) => item.id).map((item) => [item.id, item])).values(),
    );
  }

  private async getExistingIds(table: any, tableName: string, ids: string[]): Promise<Set<string>> {
    if (!ids.length) {
      return new Set();
    }

    const idsQuery = ids.map((id) => `'${id.replace(/'/g, "''")}'`).join(',');
    const records = await table
      .query(Q.unsafeSqlQuery(`SELECT id FROM ${tableName} WHERE id IN (${idsQuery})`))
      .unsafeFetchRaw();
    return new Set(records.map((record: { id: string }) => record.id));
  }

  private async accountDataInitialize(): Promise<void> {
    try {
      const { accounts: accountsCollection, transactions: transactionsCollection } =
        await this.dataSource.getAccountData();

      const uniqueAccounts = this.uniqueById<TAccount>(accountsCollection);
      const uniqueTransactions = this.uniqueById<TTransactions>(transactionsCollection);
      const accountsTable = database.collections.get<AccountModel>(ACCOUNTS);
      const transactionsTable = database.collections.get<TransactionModel>(TRANSACTIONS);
      const existingAccountIds = await this.getExistingIds(
        accountsTable,
        ACCOUNTS,
        uniqueAccounts.map((account) => account.id),
      );
      const existingTransactionIds = await this.getExistingIds(
        transactionsTable,
        TRANSACTIONS,
        uniqueTransactions.map((transaction) => transaction.id),
      );

      await database.write(async () => {
        const batchOperations = [
          ...(await Promise.all(
            uniqueAccounts.map(async (data) => {
              const { id, ...dataWithoutId } = data;

              if (!existingAccountIds.has(id)) {
                return accountsTable.prepareCreate((account) => {
                  account._raw.id = id;
                  Object.assign(account, dataWithoutId);
                });
              }

              try {
                const existingAccount = await accountsTable.find(id);
                return existingAccount.prepareUpdate((account) => {
                  Object.assign(account, dataWithoutId);
                });
              } catch (error) {
                console.warn('Skip account initialize because local id already exists:', id, error);
                return null;
              }
            }),
          )),
          ...(await Promise.all(
            uniqueTransactions.map(async (data) => {
              const { id, ...dataWithoutId } = data;

              if (!existingTransactionIds.has(id)) {
                return transactionsTable.prepareCreate((transaction) => {
                  transaction._raw.id = id;
                  Object.assign(transaction, dataWithoutId);
                });
              }

              try {
                const existingTransaction = await transactionsTable.find(id);
                return existingTransaction.prepareUpdate((transaction) => {
                  Object.assign(transaction, dataWithoutId);
                });
              } catch (error) {
                console.warn(
                  'Skip transaction initialize because local id already exists:',
                  id,
                  error,
                );
                return null;
              }
            }),
          )),
        ].filter(Boolean);

        await database.batch(...batchOperations);
      });

      // Initialize balances data
      const accountsBalance = uniqueAccounts.map((account) => ({
        accountId: account.id,
        openAmount: account.initialAmount,
        closingAmount: account.initialAmount,
      }));
      const transactionsBalance = uniqueTransactions.map((transaction) => ({
        transactionId: transaction.id,
        accountId: transaction.accountId,
        movementAmount: +transaction.amount,
        dateRecord: transaction.recordAt,
      }));
      const allBalances = [...accountsBalance, ...transactionsBalance];

      if (allBalances.length) {
        for (const balance of allBalances) {
          await balanceLocalQuery.updateBalance(balance);
        }
        for (const account of allBalances) {
          await balanceLocalQuery.calculateBalanceAccountByDate({
            accountId: account.accountId,
            date: 0,
          });
        }
      }
    } catch (error: any) {
      console.error('Failed to initialize account data:', error);
      throw new Error(`Failed to initialize account data: ${error.message}`);
    }
  }

  /**
   * Initialize banks data from the data source and store it in the database.
   * If the banks collection is empty, this method will return without making any changes.
   * @throws {Error} If there is an error during the initialization process.
   */
  private async bankInitialize(): Promise<void> {
    try {
      const banksCollection = await this.dataSource.getBanks();
      if (!size(banksCollection)) {
        return;
      }
      const banksTable = database.collections.get<BankModel>(BANKS);

      await database.write(async () => {
        const batchOperations = await Promise.all(
          banksCollection.map(async (data) => {
            try {
              // Kiểm tra xem bank đã tồn tại chưa
              const existingBank = await banksTable.find(data.id);
              const dataUpdate = { ...data } as Partial<typeof data>;
              delete dataUpdate.id;

              if (existingBank) {
                // Nếu đã tồn tại thì update
                return existingBank.prepareUpdate((bank) => {
                  Object.assign(bank, dataUpdate);
                });
              } else {
                // Nếu chưa tồn tại thì create mới
                return banksTable.prepareCreate((bank) => {
                  bank._raw.id = data.id;
                  Object.assign(bank, dataUpdate);
                });
              }
            } catch (error) {
              // Nếu không tìm thấy bank (find throws error) thì tạo mới
              return banksTable.prepareCreate((bank) => {
                bank._raw.id = data.id;
                const dataUpdate = { ...data } as Partial<typeof data>;
                delete dataUpdate.id;
                Object.assign(bank, dataUpdate);
              });
            }
          }),
        );

        await database.batch(...batchOperations);
      });
    } catch (error: any) {
      throw new Error(`Failed to initialize banks: ${error.message}`);
    }
  }

  /**
   * Initialize categories data from the data source and store it in the database.
   * If the categories collection is empty, this method will return without making any changes.
   * @throws {Error} If there is an error during the initialization process.
   */
  private async categoriesInitialize(): Promise<void> {
    try {
      const categoriesCollection = await this.dataSource.getCategories();
      if (!size(categoriesCollection)) {
        return;
      }
      const categoriesTable = database.collections.get<CategoriesModel>(TRANSACTION_CATEGORY);

      await database.write(async () => {
        const batchOperations = await Promise.all(
          categoriesCollection.map(async (data) => {
            try {
              // Kiểm tra xem category đã tồn tại chưa
              const existingCategory = await categoriesTable.find(data.id);
              const dataUpdate = { ...data } as Partial<typeof data>;
              delete dataUpdate.id;

              if (existingCategory) {
                // Nếu đã tồn tại thì update
                return existingCategory.prepareUpdate((category) => {
                  Object.assign(category, dataUpdate);
                });
              } else {
                // Nếu chưa tồn tại thì create mới
                return categoriesTable.prepareCreate((category) => {
                  category._raw.id = data.id;
                  Object.assign(category, dataUpdate);
                });
              }
            } catch (error) {
              // Nếu không tìm thấy category (find throws error) thì tạo mới
              return categoriesTable.prepareCreate((category) => {
                category._raw.id = data.id;
                const dataUpdate = { ...data } as Partial<typeof data>;
                delete dataUpdate.id;
                Object.assign(category, dataUpdate);
              });
            }
          }),
        );

        await database.batch(...batchOperations);
      });

      // set id lend & borrow vào mmkv sau này dùng cho dễ
      const lendBorrowIds = categoriesCollection
        .filter((item) => Object.values(TRANSACTION_LEND_BORROW_NAME).includes(item.categoryName))
        .reduce((acc, item) => {
          acc[item.id] = item.categoryName;
          return acc;
        }, {} as Record<string, string>);
      storageService.setItem(MMKV_KEY.LEND_BORROW_ID, JSON.stringify(lendBorrowIds));
    } catch (error: any) {
      throw new Error(`Failed to initialize categories: ${error.message}`);
    }
  }
}
