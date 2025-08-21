// src/database/local/BalanceLocalDataSource.ts

import { TBalance } from 'database/types';
import { database } from 'database/index';
import { BalanceModel } from 'database/models';
import { BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import isEmpty from 'lodash/isEmpty';
import { SQLiteQuery } from '@nozbe/watermelondb/adapters/sqlite';

/**
 * Class xử lý các thao tác với dữ liệu số dư (Balance) trong local database
 * Sử dụng mẫu Singleton để đảm bảo chỉ có một instance duy nhất
 */
export class BalanceLocalDataSource {
  /** Instance duy nhất của class */
  private static instance: BalanceLocalDataSource;

  /** Collection balance trong WatermelonDB */
  private balancesCollection = database.collections.get<BalanceModel>(BALANCE);

  /** Constructor private để ngăn tạo instance trực tiếp */
  private constructor() {}

  /**
   * Lấy instance duy nhất của class (Singleton pattern)
   * @returns Instance của BalanceLocalDataSource
   */
  public static getInstance(): BalanceLocalDataSource {
    if (!BalanceLocalDataSource.instance) {
      BalanceLocalDataSource.instance = new BalanceLocalDataSource();
    }
    return BalanceLocalDataSource.instance;
  }

  /**
   * Helper method để xử lý lỗi một cách nhất quán
   * @param code - Mã lỗi
   * @throws Error với mã lỗi được định nghĩa
   */
  private throwError(code: string): never {
    throw new Error(code);
  }

  /**
   * Truy vấn số dư gần nhất trước một ngày cụ thể cho một tài khoản
   * @param accountId - ID của tài khoản cần truy vấn
   * @param date - Timestamp của ngày cần truy vấn
   * @returns Promise chứa bản ghi balance gần nhất trước ngày được chỉ định
   *
   * Phương thức này sẽ:
   * 1. Tìm bản ghi balance có dateRecord gần nhất trước ngày chỉ định
   * 2. Trả về closingAmount và dateRecord của bản ghi đó
   * 3. Nếu không có bản ghi nào thỏa mãn, trả về undefined
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
   * Truy vấn tất cả các bản ghi số dư sau một ngày cụ thể cho một tài khoản
   * @param accountId - ID của tài khoản cần truy vấn
   * @param date - Timestamp của ngày bắt đầu truy vấn
   * @returns Promise chứa danh sách các bản ghi balance sau ngày được chỉ định
   *
   * Phương thức này sẽ:
   * 1. Lấy tất cả các bản ghi balance có dateRecord lớn hơn ngày chỉ định
   * 2. Sắp xếp kết quả theo dateRecord và ID
   * 3. Trả về raw data để dễ dàng xử lý tiếp
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
   * Tính toán lại tất cả các số dư sau một ngày cụ thể
   * @param options - Các tùy chọn tính toán
   * @param options.accountId - ID của tài khoản cần tính toán lại
   * @param options.date - Timestamp của ngày bắt đầu tính toán (mặc định là 0)
   * @returns Promise<boolean> - true nếu tính toán thành công
   *
   * Phương thức này sẽ:
   * 1. Lấy số dư gần nhất trước ngày chỉ định làm cơ sở
   * 2. Lấy tất cả bản ghi balance sau ngày đó
   * 3. Tính toán lại openAmount và closingAmount cho mỗi bản ghi
   * 4. Cập nhật đồng thời tất cả các thay đổi vào database
   * 5. Throw error nếu có lỗi xảy ra trong quá trình tính toán
   */
  public async calculateBalanceAccountByDate({
    accountId,
    date = 0,
  }: {
    accountId: string;
    date?: number | Date;
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
   * Truy vấn số dư hiện tại (mới nhất) cho một tài khoản
   * @param accountId - ID của tài khoản cần truy vấn
   * @returns Promise chứa bản ghi balance mới nhất của tài khoản
   *
   * Phương thức này sẽ:
   * 1. Lấy bản ghi balance có dateRecord mới nhất
   * 2. Trả về closingAmount và dateRecord của bản ghi đó
   * 3. Trả về undefined nếu không có bản ghi nào
   */
  public async getCurrentAccountBalance(accountId: string) {
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
   * Thêm một bản ghi số dư ban đầu cho tài khoản
   * @param balanceData - Dữ liệu số dư cần thêm mới
   * @returns Promise chứa bản ghi balance vừa được tạo
   *
   * Phương thức này sẽ:
   * 1. Tìm ID lớn nhất hiện tại để tạo ID mới
   * 2. Tạo bản ghi balance mới với các giá trị mặc định nếu không được cung cấp
   * 3. Tính toán lại các số dư sau ngày của bản ghi mới (nếu có)
   * 4. Trả về bản ghi balance mới được tạo
   */
  public async addNewBalance(balanceData: TBalance) {
    const queryMaxId = `SELECT MAX(_id) AS maxId from ${BALANCE}`;

    const balanceCreated = await database.write(async () => {
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

      return newBalance;
    });
    // tính toán lại balance
    if (balanceCreated.dateRecord) {
      await this.calculateBalanceAccountByDate({
        accountId: balanceCreated.accountId,
        date: new Date(balanceCreated.dateRecord).getTime(),
      });
    }
    return balanceCreated;
  }

  /**
   * Cập nhật bản ghi số dư liên quan đến một giao dịch
   * @param balanceData - Dữ liệu số dư cần cập nhật
   * @returns Promise<boolean> - true nếu cập nhật thành công
   *
   * Phương thức này sẽ:
   * 1. Tìm bản ghi balance dựa trên:
   *    - Nếu có transactionId: tìm theo accountId và transactionId
   *    - Nếu không có transactionId: tìm theo accountId và dateRecord là null
   * 2. Nếu tìm thấy:
   *    - Cập nhật các giá trị mới
   *    - Tính toán lại các số dư sau ngày được cập nhật
   * 3. Nếu không tìm thấy:
   *    - Tạo bản ghi balance mới
   * 4. Trả về true nếu thao tác thành công
   */
  public async updateBalance(balanceData: TBalance) {
    let isCreate = false;

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

    const balanceUpdated = await database.write(async () => {
      const currentBalanceRecords = await this.balancesCollection.query(...queryConditions).fetch();

      if (isEmpty(currentBalanceRecords)) {
        isCreate = true;
        return null;
      }

      const balanceToUpdate = currentBalanceRecords[0];
      // Nếu có accountToUpdateId thì cập nhật lại accountId
      await balanceToUpdate.update((bal) => {
        bal.accountId = balanceData?.accountToUpdateId
          ? balanceData?.accountToUpdateId
          : balanceData.accountId;
        bal.transactionId = balanceData.transactionId;
        bal.openAmount = balanceData.openAmount || 0;
        bal.movementAmount = balanceData.movementAmount || 0;
        bal.closingAmount = balanceData.closingAmount || 0;
        bal.dateRecord = balanceData.dateRecord ? new Date(balanceData.dateRecord) : undefined;
      });
      return balanceToUpdate;
    });

    // Nếu không tìm thấy bản ghi số dư, tạo mới
    if (isCreate) {
      await this.addNewBalance(balanceData);
      return true;
    }

    // tính toán lại balance
    if (balanceUpdated) {
      await this.calculateBalanceAccountByDate({
        accountId: balanceUpdated.accountId,
        date: balanceData.dateRecord,
      });
    }

    return true;
  }

  /**
   * Xóa vĩnh viễn bản ghi số dư theo transactionId
   * @param transactionId - ID của giao dịch cần xóa số dư
   * @param accountId - (Tùy chọn) ID của tài khoản để lọc thêm
   * @returns Promise<boolean> - true nếu xóa thành công
   *
   * Phương thức này sẽ:
   * 1. Tạo điều kiện xóa theo transactionId
   * 2. Thêm điều kiện accountId nếu được cung cấp
   * 3. Xóa vĩnh viễn (không phải soft delete) các bản ghi thỏa mãn
   * 4. Throw error nếu có lỗi trong quá trình xóa
   */
  public async deleteBalance({
    accountId,
    transactionId,
  }: {
    accountId: string;
    transactionId: string;
  }) {
    try {
      const queryConditions = [
        Q.where('accountId', accountId),
        Q.where('transactionId', transactionId),
      ];
      let balanceToDelete: TBalance | null = null;

      await database.write(async () => {
        const balances = await this.balancesCollection.query(...queryConditions).fetch();
        balanceToDelete = balances[0] || null;
        await this.balancesCollection.query(...queryConditions).destroyAllPermanently();
      });

      if (balanceToDelete) {
        // tính toán lại balance
        await this.calculateBalanceAccountByDate({
          accountId,
          date: balanceToDelete.dateRecord,
        });
      }
    } catch (error) {
      this.throwError('DEL-BAL');
    }
  }

  /**
   * Xóa nhiều bản ghi số dư theo danh sách transactionId
   * @param ids - Mảng các transactionId cần xóa số dư
   * @returns Promise<void>
   *
   * Phương thức này sẽ:
   * 1. Xóa vĩnh viễn tất cả các bản ghi balance có transactionId nằm trong danh sách
   * 2. Sử dụng Q.oneOf để tối ưu hiệu suất truy vấn
   */
  public async deleteBalancesByTransactionIds(ids: string[]) {
    await this.balancesCollection
      .query(Q.where('transactionId', Q.oneOf(ids)))
      .destroyAllPermanently();
  }
}

export const balanceLocalQuery = BalanceLocalDataSource.getInstance();
