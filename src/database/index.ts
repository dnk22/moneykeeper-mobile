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
import { ACCOUNTS, BALANCE, BANKS, CONTACT, SYNC_QUEUE, TRANSACTION_CATEGORY, TRANSACTIONS } from './constants';

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
      // 1. Xóa các bản ghi SyncQueue
      await database.collections.get(SYNC_QUEUE).query().destroyAllPermanently();

      // 2. Xóa các bản ghi Balance vì nó phụ thuộc vào Transaction và Account
      await database.collections.get(BALANCE).query().destroyAllPermanently();

      // 3. Xóa các bản ghi Transaction vì nó phụ thuộc vào Account và Category
      await database.collections.get(TRANSACTIONS).query().destroyAllPermanently();

      // 4. Xóa các bản ghi Account
      await database.collections.get(ACCOUNTS).query().destroyAllPermanently();

      // 5. Xóa các bản ghi Contact
      await database.collections.get(CONTACT).query().destroyAllPermanently();

      // 6. Xóa các bản ghi Category
      await database.collections.get(TRANSACTION_CATEGORY).query().destroyAllPermanently();

      // 7. Xóa các bản ghi Bank
      await database.collections.get(BANKS).query().destroyAllPermanently();
    });
  } catch (error) {
    throw new Error('Failed to clear database');
  }
};
