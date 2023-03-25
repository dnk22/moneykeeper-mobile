import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
const jsonBankData = require('utils/data/banks.default.json');

/** observe */

export const getBanksObserve = () => database.get<BankModel>(BANKS).query().observe();

/** read */

export const getBanksDataLocal = async ({
  isWallet,
  text = '',
}: {
  isWallet: boolean;
  text?: string;
}) => {
  try {
    return await database.read(async () => {
      return await database
        .get<BankModel>(BANKS)
        .query(
          Q.where('is_wallet', isWallet),
          Q.where('short_name', Q.like(`${Q.sanitizeLikeString(text)}%`)),
        )
        .fetch();
    });
  } catch (error) {
    console.log(error, 'get count err');
  }
};

export const getIsBankDataExist = async () => {
  try {
    return await database.read(async () => {
      return await database.get<BankModel>(BANKS).query().fetchCount();
    });
  } catch (error) {
    console.log(error, 'get bank count exist err');
  }
};

export const getBankById = async (id: string) => {
  try {
    return await database.read(async () => {
      return await database.get<BankModel>(BANKS).find(id);
    });
  } catch (error) {
    console.log(error, 'get bank by id err');
  }
};

/** update */

export const importDefaultBanksData = async () => {
  try {
    await database.write(async () => {
      for (const record of jsonBankData) {
        await database.get<BankModel>(BANKS).create((bank) => {
          bank.bankCode = record.bank_code;
          bank.bankName = record.bank_name;
          bank.shortName = record.short_name;
          bank.icon = record.icon;
          bank.isSystem = record.is_system;
          bank.isWallet = record.is_wallet;
        });
      }
    });
    console.log('Import completed!');
  } catch (error) {
    console.log('Import failed: ', error);
  }
};

/** delete */
