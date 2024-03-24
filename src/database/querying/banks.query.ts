import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
import { BANK_TYPE } from 'utils/constant';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';
const jsonBankData = require('utils/data/banks.default.json');

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

export const queryGetBankById = async (id: string) => {
  try {
    return await database.read(async () => {
      return await database.get<BankModel>(BANKS).find(id);
    });
  } catch (error) {
    console.log(error, 'get bank by id err');
  }
};

/** create */
export const importDefaultBanksData = async () => {
  try {
    const isHaveDataInit = await database.read(async () => {
      return await database.get<BankModel>(BANKS).query().fetchCount();
    });
    if (Boolean(isHaveDataInit)) {
      return;
    }
    var startTime = performance.now();
    const updateStatements: SQLiteQuery[] = jsonBankData.map((bank) => {
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
    console.log('Import completed!');
  } catch (error) {
    console.log('Import failed: ', error);
  }
};

/** delete */
