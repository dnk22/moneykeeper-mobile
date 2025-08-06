import { TInitializer, InitializerOptions, InitializerDataSource } from './types';
import { BANKS, TRANSACTION_CATEGORY } from 'database/constants';
import { database } from 'database/index';
import { BankModel } from 'database/models';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import size from 'lodash/size';

export class Initializer implements TInitializer {
  private dataSource: InitializerDataSource;

  constructor(options: InitializerOptions) {
    this.dataSource = options.dataSource;
  }

  async initialize(): Promise<void> {
    await this.bankInitialize();
    await this.categoriesInitialize();
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
  async categoriesInitialize(): Promise<void> {
    try {
      const categoriesCollection = await this.dataSource.getCategories();
      if (!size(categoriesCollection)) {
        return;
      }
      const categoriesTable =
        database.collections.get<TransactionCategoryModel>(TRANSACTION_CATEGORY);

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
    } catch (error: any) {
      throw new Error(`Failed to initialize categories: ${error.message}`);
    }
  }
}
