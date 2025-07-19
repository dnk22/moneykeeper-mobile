import { Initializer, InitializerOptions, InitializerDataSource } from '../types';
import { BANKS } from 'database/constants';
import { database } from 'database/index';
import { BankModel } from 'database/models';
import size from 'lodash/size';

export class BankInitializer implements Initializer {
  private dataSource: InitializerDataSource;

  constructor(options: InitializerOptions) {
    this.dataSource = options.dataSource;
  }

  async initialize(): Promise<void> {
    try {
      var startTime = performance.now();
      const banksCollection = await this.dataSource.getBanks();
      if (!size(banksCollection)) {
        return;
      }
      const banksTable = database.collections.get<BankModel>(BANKS);
      await database.write(async () => {
        await database.batch(
          ...banksCollection.map((data) =>
            banksTable.prepareCreate((bank) => {
              Object.assign(bank, { ...data, create: '' });
            }),
          ),
        );
      });
      var endTime = performance.now();
      console.log(`Import bank data: ${Number((endTime - startTime) / 1000).toFixed(5)} s`);
    } catch (error: any) {
      console.error('Error initializing banks:', error);
      throw new Error(`Failed to initialize banks: ${error.message}`);
    }
  }
}
