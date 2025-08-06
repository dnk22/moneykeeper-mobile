import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
// import migrations from './migrations';
import {
  AccountModel,
  TransactionModel,
  TransactionCategory,
  BankModel,
  ContactModel,
  BalanceModel,
  SyncQueueModel,
} from './models';
import {
  ACCOUNTS,
  BALANCE,
  BANKS,
  CONTACT,
  SYNC_QUEUE,
  TRANSACTION_CATEGORY,
  TRANSACTIONS,
} from './constants';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  // migrations,
  // (optional database name or file system path)
  dbName: 'personalExpense',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    // Database failed to load -- offer the user to reload the app or log out
  },
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    AccountModel,
    TransactionModel,
    TransactionCategory,
    BankModel,
    ContactModel,
    BalanceModel,
    SyncQueueModel,
  ],
});

/**
 * Xóa toàn bộ dữ liệu trong database
 * @returns Promise<void>
 *
 * Phương thức này sẽ:
 * 1. Xóa dữ liệu từ tất cả các bảng theo thứ tự để tránh lỗi khóa ngoại
 * 2. Thực hiện trong một transaction để đảm bảo tính nhất quán
 * 3. Rollback nếu có lỗi xảy ra trong quá trình xóa
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await database.write(async () => {
      // Lấy danh sách các collection
      const collectionsToClear = [
        database.collections.get(SYNC_QUEUE),
        database.collections.get(TRANSACTIONS),
        database.collections.get(ACCOUNTS),
        database.collections.get(BALANCE),
        database.collections.get(CONTACT),
        database.collections.get(TRANSACTION_CATEGORY),
        database.collections.get(BANKS),
      ];

      // Xóa tất cả các bản ghi trong mỗi collection
      for (const collection of collectionsToClear) {
        await collection.query().destroyAllPermanently();
      }
    });
  } catch (error) {
    throw new Error('Failed to clear database');
  }
};
