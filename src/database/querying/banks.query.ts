import { database } from 'database/index';
import { Q } from '@nozbe/watermelondb';
import { BankModel } from 'database/models';
import { BANKS } from 'database/constants';
import { BANK_TYPE } from 'utils/constants/account';

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

/** delete */
