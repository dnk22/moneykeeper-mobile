// src/database/local/TransactionLocalDataSource.ts

import { database } from 'database/index';
import { ACCOUNTS, BALANCE, TRANSACTIONS, TRANSACTION_CATEGORY } from 'database/constants';
import { TransactionModel } from 'database/models';
import { TTransactions } from 'database/types';
import { Q } from '@nozbe/watermelondb';
import isEqual from 'lodash/isEqual';
import { TRANSACTION_TYPE } from 'utils/constants';
import { balanceLocalQuery } from './balance';
import { categoriesLocalQuery } from './categories';

export type GetTransactionByDateOptions = {
  date: string;
  accountId: string;
};

export type GetTransactionsListByMonthOptions = {
  accountId: string;
  startDate: Date;
  endDate: Date;
  getAll?: boolean | string;
};

// --- TransactionLocalDataSource Class ---
/**
 * Class xử lý các thao tác với dữ liệu giao dịch trong local database
 * Sử dụng mẫu Singleton để đảm bảo chỉ có một instance duy nhất
 */
export class TransactionLocalDataSource {
  /** Instance duy nhất của class */
  private static instance: TransactionLocalDataSource;

  /** Collection giao dịch trong WatermelonDB */
  private transactionsCollection = database.collections.get<TransactionModel>(TRANSACTIONS);

  /** Constructor private để ngăn tạo instance trực tiếp */
  private constructor() {}

  /**
   * Lấy instance duy nhất của class (Singleton pattern)
   * @returns Instance của TransactionLocalDataSource
   */
  public static getInstance(): TransactionLocalDataSource {
    if (!TransactionLocalDataSource.instance) {
      TransactionLocalDataSource.instance = new TransactionLocalDataSource();
    }
    return TransactionLocalDataSource.instance;
  }

  /**
   * Helper method để xử lý lỗi một cách nhất quán
   * @param code - Mã lỗi
   * @param message - Thông báo lỗi tùy chỉnh (không bắt buộc)
   * @throws Error với mã lỗi và thông báo
   */
  private throwError(code: string, message?: string): never {
    throw new Error(message || `Transaction operation failed: ${code}`);
  }

  /**
   * Truy vấn các ngày giao dịch duy nhất cho một tài khoản, nhóm theo ngày.
   */
  /**
   * Truy vấn danh sách các ngày có giao dịch của một tài khoản
   * @param accountId - ID của tài khoản cần truy vấn
   * @returns Promise chứa mảng các ngày duy nhất có giao dịch, được sắp xếp giảm dần
   *
   * Phương thức này sẽ:
   * 1. Lọc các giao dịch chưa bị xóa (_status != 'deleted')
   * 2. Tìm các giao dịch mà tài khoản là người gửi hoặc người nhận
   * 3. Chuyển đổi timestamp thành định dạng ngày YYYY-MM-DD
   * 4. Loại bỏ các ngày trùng lặp (DISTINCT)
   */
  public async getUniqueTransactionDates(accountId: string) {
    const query = `SELECT DISTINCT 
      strftime('%Y-%m-%d', datetime(recordAt/1000, 'unixepoch')) AS date 
      FROM ${TRANSACTIONS}
      WHERE _status != 'deleted' AND ((accountId='${accountId}') OR (toAccountId='${accountId}'))
      ORDER BY recordAt DESC 
    `;
    return await database.read(async () => {
      return await this.transactionsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
    });
  }

  /**
   * Truy vấn danh sách giao dịch theo tháng.
   * Bao gồm thông tin từ Category, Balance và Account liên quan.
   */
  /**
   * Truy vấn danh sách giao dịch trong một khoảng thời gian (tháng)
   * @param options - Các tùy chọn truy vấn
   * @param options.accountId - ID của tài khoản cần truy vấn
   * @param options.startDate - Ngày bắt đầu
   * @param options.endDate - Ngày kết thúc
   * @param options.getAll - Flag để lấy tất cả giao dịch hay chỉ trong khoảng thời gian
   * @returns Promise chứa danh sách giao dịch với thông tin đầy đủ từ các bảng liên quan
   *
   * Phương thức này sẽ:
   * 1. Join với bảng Category để lấy thông tin danh mục
   * 2. Join với bảng Balance để lấy số dư
   * 3. Join với bảng Account để lấy tên tài khoản gửi/nhận
   * 4. Lọc theo khoảng thời gian nếu getAll = false
   * 5. Sắp xếp theo thời gian giảm dần
   */
  public async getTransactionsListByMonth({
    accountId,
    startDate,
    endDate,
    getAll = false,
  }: GetTransactionsListByMonthOptions) {
    const startOfDay = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)).getTime();
    const shouldGetAll = typeof getAll === 'string' ? getAll === 'true' : getAll;
    const dateQuery = shouldGetAll ? `AND tran.recordAt BETWEEN ${startOfDay} AND ${endOfDay}` : '';

    const query = `SELECT tran.id, tran.accountId, tran.toAccountId, tran.categoryId,tran.transactionType, tran.descriptions, tran.recordAt, bal._id, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName, bal.closingAmount AS closingAmount,bal.movementAmount AS amount,
      CASE
        WHEN tran.accountId = '${accountId}' THEN accTo.accountName
        WHEN tran.toAccountId = '${accountId}' THEN acc.accountName
      END AS accountName
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      LEFT JOIN ${BALANCE} bal ON bal.transactionId=tran.id AND bal.accountId='${accountId}'
      LEFT JOIN ${ACCOUNTS} acc ON acc.id=tran.accountId
      LEFT JOIN ${ACCOUNTS} accTo ON accTo.id=tran.toAccountId
      WHERE tran._status != 'deleted' AND ((tran.accountId='${accountId}') OR (tran.toAccountId='${accountId}')) ${dateQuery}
      ORDER BY tran.recordAt DESC, bal._id DESC 
    `;
    return await database.read(async () => {
      return await this.transactionsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
    });
  }

  /**
   * Truy vấn danh sách giao dịch theo ngày cụ thể.
   */
  /**
   * Truy vấn danh sách giao dịch trong một ngày cụ thể
   * @param options - Các tùy chọn truy vấn
   * @param options.date - Ngày cần truy vấn (định dạng YYYY-MM-DD)
   * @param options.accountId - ID của tài khoản cần truy vấn
   * @returns Promise chứa danh sách giao dịch trong ngày với thông tin đầy đủ
   *
   * Phương thức này sẽ:
   * 1. Chuyển đổi ngày thành timestamp start và end của ngày
   * 2. Join với các bảng liên quan để lấy thông tin đầy đủ
   * 3. Lọc theo khoảng thời gian trong ngày
   * 4. Sắp xếp theo thời gian giảm dần
   */
  public async getTransactionsListByDate({ date, accountId }: GetTransactionByDateOptions) {
    const startOfDay = new Date(new Date(date).setUTCHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(new Date(date).setUTCHours(23, 59, 59, 999)).getTime();
    const query = `SELECT tran.id, tran.accountId, tran.toAccountId, tran.categoryId,tran.transactionType, tran.descriptions, tran.recordAt, bal._id, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName, bal.closingAmount AS closingAmount,bal.movementAmount AS amount,
      CASE
        WHEN tran.accountId = '${accountId}' THEN accTo.accountName
        WHEN tran.toAccountId = '${accountId}' THEN acc.accountName
      END AS accountName
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      LEFT JOIN ${BALANCE} bal ON bal.transactionId=tran.id AND bal.accountId='${accountId}'
      LEFT JOIN ${ACCOUNTS} acc ON acc.id=tran.accountId
      LEFT JOIN ${ACCOUNTS} accTo ON accTo.id=tran.toAccountId
      WHERE tran._status != 'deleted' AND ((tran.accountId='${accountId}') OR (tran.toAccountId='${accountId}')) AND tran.recordAt BETWEEN ${startOfDay} AND ${endOfDay}
      ORDER BY tran.recordAt DESC, bal._id DESC 
    `;
    return await database.read(async () => {
      return await this.transactionsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
    });
  }

  /**
   * Truy vấn giao dịch theo ID.
   */
  /**
   * Truy vấn thông tin một giao dịch theo ID
   * @param id - ID của giao dịch cần truy vấn
   * @returns Promise chứa thông tin giao dịch hoặc null nếu không tìm thấy
   *
   * Phương thức này sẽ:
   * 1. Tìm giao dịch chưa bị xóa theo ID
   * 2. Trả về null nếu không tìm thấy giao dịch
   */
  public async getTransactionById(id: string) {
    const query = `select * from ${TRANSACTIONS} where id='${id}' and _status != 'deleted'`;
    return await database.read(async () => {
      const res = await this.transactionsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
      return res[0] || null; // Trả về null nếu không tìm thấy
    });
  }

  /**
   * Truy vấn các giao dịch gần đây với giới hạn số lượng.
   */
  /**
   * Truy vấn danh sách giao dịch gần đây nhất
   * @param limit - Số lượng giao dịch tối đa cần lấy
   * @returns Promise chứa danh sách giao dịch gần đây với thông tin đầy đủ
   *
   * Phương thức này sẽ:
   * 1. Join với các bảng liên quan để lấy thông tin đầy đủ
   * 2. Lọc các giao dịch chưa bị xóa
   * 3. Sắp xếp theo thời gian giảm dần
   * 4. Giới hạn số lượng kết quả trả về
   */
  public async getRecentTransactions(limit: number) {
    const query = `SELECT tran.id,tran.amount, tran.accountId, tran.toAccountId, tran.categoryId,tran.transactionType, tran.descriptions, tran.recordAt, bal._id, tCategory.icon AS categoryIcon, tCategory.categoryName AS categoryName, bal.closingAmount AS closingAmount,bal.movementAmount AS amount
      FROM ${TRANSACTIONS} tran
      LEFT JOIN ${TRANSACTION_CATEGORY} tCategory ON tCategory.id=tran.categoryId
      LEFT JOIN ${BALANCE} bal ON bal.transactionId=tran.id AND bal.accountId=tran.accountId
      LEFT JOIN ${ACCOUNTS} acc ON acc.id=tran.accountId
      LEFT JOIN ${ACCOUNTS} accTo ON accTo.id=tran.toAccountId
      WHERE tran._status != 'deleted'
      ORDER BY tran.recordAt DESC, bal._id DESC 
      LIMIT ${limit}
    `;
    return await database.read(async () => {
      return await this.transactionsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
    });
  }

  /**
   * Thêm một giao dịch mới.
   * LƯU Ý: Logic cập nhật useCount trong category sẽ được xử lý ở lớp trên categoriesLocalQuery.
   */
  /**
   * Thêm một giao dịch mới vào database
   * @param transactionData - Dữ liệu của giao dịch cần thêm
   * @returns Promise chứa giao dịch vừa được tạo
   *
   * Phương thức này sẽ:
   * 1. Tạo một bản ghi mới trong bảng Transactions
   * 2. Tự động thêm timestamp tạo và cập nhật
   */
  public async addNewTransaction(transactionData: TTransactions): Promise<TransactionModel> {
    const transactionCreated = await database.write(async () => {
      const newTransaction = await this.transactionsCollection.create((item) => {
        Object.assign(item, transactionData);
      });
      return newTransaction;
    });

    // // Update the usage count for the transaction category
    if (transactionCreated.categoryId) {
      await categoriesLocalQuery.updateCategoryUseCount(transactionCreated.categoryId);
    }

    return transactionCreated;
  }

  /**
   * Cập nhật một giao dịch hiện có.
   * Trả về các thông tin cần thiết để lớp trên xử lý logic cập nhật category useCount và balance.
   */
  /**
   * Cập nhật thông tin một giao dịch
   * @param params - Tham số cập nhật
   * @param params.id - ID của giao dịch cần cập nhật
   * @param params.data - Dữ liệu mới cần cập nhật
   * @returns Promise chứa kết quả cập nhật và các flag cần thiết cho xử lý tiếp theo
   *
   * Phương thức này sẽ:
   * 1. Lưu trữ dữ liệu cũ để so sánh thay đổi
   * 2. Cập nhật thông tin giao dịch với dữ liệu mới
   * 3. Tự động cập nhật timestamp
   * 4. Trả về các flag để lớp service xử lý:
   *    - isUpdateCountCategory: có cần cập nhật useCount của category
   *    - isUpdateBalance: có cần tính toán lại số dư
   *    - Các thông tin cũ để tính toán lại số dư nếu cần
   */
  public async updateTransaction({ id, data }: { id: string; data: TTransactions }): Promise<{
    isUpdateBalance: boolean;
    transactionUpdated: TransactionModel;
    prevTransaction: Partial<TTransactions>;
  }> {
    try {
      let isUpdateCountCategory = false;
      let isUpdateBalance = false;
      let prevTransaction: Partial<TTransactions> = {};

      const transactionUpdated = await database.write(async () => {
        const transactionToUpdate = await this.transactionsCollection.find(id);

        /** Nếu true, update category useCount */
        isUpdateCountCategory = transactionToUpdate.categoryId !== data.categoryId;

        /** Lưu trữ dữ liệu cũ để so sánh */
        isUpdateBalance =
          !isEqual(transactionToUpdate.amount, data.amount) ||
          !isEqual(new Date(transactionToUpdate.recordAt).getTime(), data.recordAt) ||
          !isEqual(transactionToUpdate.accountId, data.accountId) ||
          !isEqual(transactionToUpdate.toAccountId, data.toAccountId);

        prevTransaction = {
          accountId: transactionToUpdate.accountId,
          toAccountId: transactionToUpdate.toAccountId,
          recordAt: new Date(transactionToUpdate.recordAt).getTime(),
        };

        /** Cập nhật dữ liệu */
        const transactionUpdated = await transactionToUpdate.update((item) => {
          Object.assign(item, data);
        });

        return transactionUpdated;
      });

      /** Nếu true, update category useCount */
      if (isUpdateCountCategory) {
        await categoriesLocalQuery.updateCategoryUseCount(data.categoryId);
      }

      return {
        isUpdateBalance,
        transactionUpdated,
        prevTransaction,
      };
    } catch (error) {
      this.throwError('UPD-TRANS');
    }
  }

  /**
   * Đánh dấu một giao dịch là đã xóa (soft delete).
   * Trả về giao dịch đã bị xóa để lớp trên xử lý việc cập nhật balance.
   */
  /**
   * Xóa mềm một giao dịch (đánh dấu là đã xóa)
   * @param id - ID của giao dịch cần xóa
   * @returns Promise chứa giao dịch đã bị xóa
   *
   * Phương thức này sẽ:
   * 1. Tìm giao dịch theo ID
   * 2. Đánh dấu giao dịch là đã xóa (soft delete)
   * 3. Trả về giao dịch đã xóa để lớp service tính toán lại số dư
   */
  public async softDeleteTransactionById(id: string): Promise<TransactionModel> {
    try {
      return await database.write(async () => {
        const transactionToDelete = await this.transactionsCollection.find(id);
        await transactionToDelete.markAsDeleted();
        return transactionToDelete;
      });
    } catch (error) {
      this.throwError('DEL-TRANS');
    }
  }

  /**
   * Xóa tất cả giao dịch liên quan đến một tài khoản
   * @param accountId - ID của tài khoản cần xóa giao dịch
   * @returns Promise chứa thông tin cần thiết để tính toán lại số dư
   *
   * Phương thức này sẽ:
   * 1. Tìm các giao dịch chuyển khoản liên quan đến tài khoản
   * 2. Xóa các bản ghi balance liên quan
   * 3. Thu thập thông tin các tài khoản cần tính toán lại số dư
   * 4. Xóa vĩnh viễn tất cả giao dịch liên quan đến tài khoản
   * 5. Trả về:
   *    - accountBalanceRecalculation: Danh sách tài khoản cần tính lại số dư
   *    - transactionIds: Danh sách ID các giao dịch đã xóa
   */
  public async clearTransactionsForAccount(accountId: string): Promise<{
    accountBalanceRecalculation: { accountId: string; recordAt: number }[];
    transactionIds: string[];
  }> {
    try {
      //   let accountBalanceRecalculation: { accountId: string; recordAt: number }[] = [];
      return await database.write(async () => {
        // Lấy các giao dịch chuyển khoản liên quan đến accountId
        const transferTransactions = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT id FROM ${TRANSACTIONS} 
              WHERE transactionType=${TRANSACTION_TYPE.TRANSFER} 
              AND _status!='deleted' 
              AND (toAccountId='${accountId}' OR accountId='${accountId}')`,
            ),
          )
          .unsafeFetchRaw();

        // Xóa các bản ghi balance liên quan đến các giao dịch chuyển khoản này
        if (transferTransactions && transferTransactions.length > 0) {
          await balanceLocalQuery.deleteBalancesByTransactionIds(
            Array.from(transferTransactions.map((item) => item.id)),
          );
        }

        // Lấy các account cần tính toán lại số dư trong các transactions trước khi xóa
        const accountBalanceRecalculation = await this.transactionsCollection
          .query(
            Q.unsafeSqlQuery(
              `SELECT accountId, recordAt FROM ${TRANSACTIONS} 
              WHERE (toAccountId='${accountId}' OR accountId='${accountId}') 
              GROUP BY accountId HAVING MIN(recordAt)`,
            ),
          )
          .unsafeFetchRaw();

        // lấy tất cả các transactions id trong account
        const transactionIds: string[] = await this.transactionsCollection
          .query(Q.or(Q.where('toAccountId', accountId), Q.where('accountId', accountId)))
          .fetchIds();

        // Xóa vĩnh viễn các giao dịch nơi toAccountId hoặc accountId là accountId đang xét
        await this.transactionsCollection
          .query(Q.or(Q.where('toAccountId', accountId), Q.where('accountId', accountId)))
          .destroyAllPermanently();

        return { accountBalanceRecalculation, transactionIds };
      });
    } catch (error) {
      this.throwError('DEL-ALL-REL');
    }
  }
}

export const transactionLocalQuery = TransactionLocalDataSource.getInstance();
