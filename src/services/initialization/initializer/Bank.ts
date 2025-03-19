import { Initializer, InitializerOptions, InitializerDataSource } from '../types';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';
import { BANKS } from 'database/constants';
import { database } from 'database/index';

export class BankInitializer implements Initializer {
  private dataSource: InitializerDataSource;

  constructor(options: InitializerOptions) {
    this.dataSource = options.dataSource;
  }

  async initialize(): Promise<void> {
    try {
      var startTime = performance.now();
      const banksCollection = await this.dataSource.getBanks();
      const updateStatements: SQLiteQuery[] = banksCollection.map((bank) => {
        const { id, bankCode, bankName, shortName, icon, isSystem, type } = bank;
        return [
          `INSERT INTO ${BANKS} (id, bankCode, bankName, shortName, icon, isSystem, type, _changed, _status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, bankCode, bankName, shortName, icon, isSystem, type, '', 'created'],
        ];
      });

      await database.write(async () => {
        return await database.adapter.unsafeExecute({
          sqls: updateStatements,
        });
      });
      var endTime = performance.now();
      console.log(`Import bank data: ${Number((endTime - startTime) / 1000).toFixed(5)} s`);
    } catch (error: any) {
      console.error('Error initializing banks:', error);
      throw new Error(`Failed to initialize banks: ${error.message}`);
    }
  }
}
