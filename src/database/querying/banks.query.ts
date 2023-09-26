import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
import { BANK_TYPE } from 'utils/constant';
const jsonBankData = require('utils/data/banks.default.json');

/** observe */

export const getBanksObserve = () => database.get<BankModel>(BANKS).query().observe();

/** read */

export const getBanksDataLocal = async ({
  type = BANK_TYPE.BANK,
  text = '',
}: {
  type: BANK_TYPE;
  text?: string;
}) => {
  try {
    return await database.read(async () => {
      return await database
        .get<BankModel>(BANKS)
        .query(
          Q.where('type', type.toString()),
          Q.or(
            Q.where('shortName', Q.like(`${Q.sanitizeLikeString(text)}%`)),
            Q.where('bankCode', Q.like(`${Q.sanitizeLikeString(text)}%`)),
            Q.where('bankName', Q.like(`${Q.sanitizeLikeString(text)}%`)),
          ),
        )
        .fetch();
    });
  } catch (error) {
    console.log(error, 'get count err');
    return error;
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
          bank.bankCode = record.bankCode;
          bank.bankName = record.bankName;
          bank.shortName = record.shortName;
          bank.icon = record.icon;
          bank.isSystem = record.isSystem;
          bank.type = record.type;
        });
      }
    });
    console.log('Import completed!');
  } catch (error) {
    console.log('Import failed: ', error);
  }
};

/** delete */
