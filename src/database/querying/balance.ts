// src/database/local/BalanceLocalDataSource.ts

import { TBalance } from 'database/types';
import { database } from 'database/index';
import { BalanceModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import isEmpty from 'lodash/isEmpty';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';

// --- BalanceLocalDataSource Class ---
export class BalanceLocalDataSource {
  private static instance: BalanceLocalDataSource;
  private balancesCollection = database.collections.get<BalanceModel>(BALANCE);

  private constructor() {}

  public static getInstance(): BalanceLocalDataSource {
    if (!BalanceLocalDataSource.instance) {
      BalanceLocalDataSource.instance = new BalanceLocalDataSource();
    }
    return BalanceLocalDataSource.instance;
  }

  // Helper to throw errors consistently
  private throwError(code: string): never {
    throw new Error(code);
  }

  /**
   * Truy vấn số dư gần nhất trước một ngày cụ thể cho một tài khoản.
   */
  private async getLatestAccountBalanceByDate(accountId: string, date: number) {
    const query = `SELECT closingAmount, dateRecord FROM ${BALANCE}
                  WHERE accountId='${accountId}'
                  AND (
                    dateRecord < ${date}
                    OR dateRecord IS NULL
                  )
                  ORDER BY dateRecord DESC, _id DESC  
                  LIMIT 1`;
    return await database.read(async () => {
      const result = await this.balancesCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
      return result[0];
    });
  }

  /**
   * Truy vấn tất cả các bản ghi số dư sau một ngày cụ thể cho một tài khoản.
   */
  private async getAllBalanceAfterDate(accountId: string, date: number) {
    const query = `SELECT * FROM ${BALANCE}
                  WHERE accountId='${accountId}'
                  AND dateRecord > ${date}
                  ORDER BY dateRecord, id`; // Sử dụng 'id' của WMDB thay vì '_id' nếu '_id' không phải PK
    return await database.read(async () => {
      return await this.balancesCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
    });
  }

  /**
   * Tính toán lại tất cả các số dư sau một ngày cụ thể.
   */
  public async calculateAllBalanceAfterDate({
    accountId,
    date = 0,
  }: {
    accountId: string;
    date?: number;
  }) {
    try {
      const latestBalance = await this.getLatestAccountBalanceByDate(
        accountId,
        new Date(date).getTime(),
      );
      const closingAmount = latestBalance?.closingAmount || 0;
      const prevDate = latestBalance?.dateRecord || 0;

      const recordsToUpdate = await this.getAllBalanceAfterDate(accountId, prevDate);
      if (isEmpty(recordsToUpdate)) {
        return;
      }

      /** calculate all openAmount and closingAmount base on current amount */
      const newDataUpdate = recordsToUpdate.map((item, index) => {
        item.openAmount = index ? recordsToUpdate[index - 1].closingAmount : closingAmount;
        item.closingAmount = item.openAmount + item.movementAmount;
        return item;
      });

      /** generate query by new update data above */
      const updateStatements: SQLiteQuery[] = newDataUpdate.map((record) => {
        const { id, openAmount, closingAmount } = record;
        return [
          `UPDATE ${BALANCE} SET openAmount = ?, closingAmount = ? where id = ?`,
          [openAmount, closingAmount, id],
        ];
      });

      return database.write(async () => {
        await database.adapter.unsafeExecute({
          sqls: updateStatements,
        });
        return true;
      });
    } catch (error) {
      this.throwError('UD-BAL-CAL');
    }
  }

  /**
   * Truy vấn số dư hiện tại (mới nhất) cho một tài khoản.
   */
  public async getCurrentBalance(accountId: string) {
    const query = `SELECT closingAmount, dateRecord FROM ${BALANCE}
                  WHERE accountId='${accountId}'
                  ORDER BY dateRecord DESC, id DESC -- Sử dụng 'id' của WMDB thay vì '_id' nếu '_id' không phải PK
                  LIMIT 1`;
    return await database.read(async () => {
      const result = await this.balancesCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
      return result[0];
    });
  }

  /**
   * Thêm một bản ghi số dư ban đầu cho tài khoản.
   */
  public async addNewBalance(balanceData: TBalance) {
    const queryMaxId = `SELECT MAX(_id) AS maxId from ${BALANCE}`;

    return await database.write(async () => {
      let nextId = 1;
      const result = await this.balancesCollection
        .query(Q.unsafeSqlQuery(queryMaxId))
        .unsafeFetchRaw();
      if (result && result[0]) {
        nextId = result[0].maxId + 1;
      }

      const newBalance = await this.balancesCollection.create((item) => {
        Object.assign(item, {
          ...balanceData,
          openAmount: balanceData.openAmount || 0,
          movementAmount: balanceData.movementAmount || 0,
          closingAmount: balanceData.closingAmount || 0,
          _id: nextId,
        });
      });
      // tính toán lại balance
      if (newBalance.dateRecord) {
        await this.calculateAllBalanceAfterDate({
          accountId: newBalance.accountId,
          date: new Date(newBalance.dateRecord).getTime(),
        });
      }
      return newBalance;
    });
  }

  /**
   * Cập nhật bản ghi số dư liên quan đến một giao dịch.
   * Chỉ cần update movementAmount. Tự tính các giá trị còn lại sau khi update : calculateAllBalanceAfterDate
   */
  public async updateBalance(balanceData: TBalance) {
    let queryConditions = [
      Q.where('accountId', balanceData.accountId),
      Q.where('dateRecord', null),
    ];

    // nếu có transactionId thì đang update từ transaction
    if (balanceData.transactionId) {
      queryConditions = [
        Q.where('accountId', balanceData.accountId),
        Q.where('transactionId', balanceData.transactionId),
      ];
    }

    return await database.write(async () => {
      const currentBalanceRecords = await this.balancesCollection.query(...queryConditions).fetch();

      if (!isEmpty(currentBalanceRecords)) {
        const balanceToUpdate = currentBalanceRecords[0];
        await balanceToUpdate.update((bal) => {
          bal.accountId = balanceData.accountId;
          bal.transactionId = balanceData.transactionId;
          bal.openAmount = balanceData.openAmount || 0;
          bal.movementAmount = balanceData.movementAmount || 0;
          bal.closingAmount = balanceData.closingAmount || 0;
          bal.dateRecord = balanceData.dateRecord ? new Date(balanceData.dateRecord) : undefined;
        });

        // tính toán lại balance
        await this.calculateAllBalanceAfterDate({
          accountId: balanceToUpdate.accountId,
          date: balanceData.dateRecord,
        });
        return true;
      } else {
        // Nếu không tìm thấy bản ghi số dư, tạo mới
        await this.addNewBalance(balanceData);
        return true;
      }
    });
  }

  /**
   * Xóa vĩnh viễn bản ghi số dư theo transactionId.
   */
  public async deleteBalanceByTransactionId(transactionId: string, accountId?: string) {
    try {
      const queryConditions = [Q.where('transactionId', transactionId)];
      if (accountId) {
        queryConditions.push(Q.where('accountId', accountId));
      }
      return await database.write(async () => {
        await this.balancesCollection.query(...queryConditions).destroyAllPermanently(); // Sử dụng destroyAllPermanently
        return true;
      });
    } catch (error) {
      this.throwError('DEL-BAL');
    }
  }

  public async deleteBalancesByIds(ids: string[]) {
    await this.balancesCollection
      .query(Q.where('transactionId', Q.oneOf(ids)))
      .destroyAllPermanently();
  }
}

export const balanceLocalQuery = BalanceLocalDataSource.getInstance();
