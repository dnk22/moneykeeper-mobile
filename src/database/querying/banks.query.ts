import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';
import { BANK_TYPE } from 'utils/constants/account';
const jsonBankData = require('utils/data/banks.default.json');

/** read */
export const queryGetBank = async ({
  type = BANK_TYPE.BANK,
  text = '',
}: {
  type?: BANK_TYPE;
  text?: string;
}) => {
  return await database.read(async () => {
    const baseQuery = Q.where('type', type.toString());

    if (!type && !text) {
      return await database.get<BankModel>(BANKS).query().fetch();
    }

    if (!text.trim()) {
      return await database.get<BankModel>(BANKS).query(baseQuery).fetch();
    }

    const searchText = Q.sanitizeLikeString(text);
    return await database
      .get<BankModel>(BANKS)
      .query(
        baseQuery, // Điều kiện bắt buộc
        Q.or(
          Q.where('shortName', Q.like(`${searchText}%`)),
          Q.where('bankCode', Q.like(`${searchText}%`)),
          Q.where('bankName', Q.like(`${searchText}%`)),
        ),
      )
      .fetch();
  });
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
  } catch (error) {
    console.log('Import failed: ', error);
  }
};

/** delete */
