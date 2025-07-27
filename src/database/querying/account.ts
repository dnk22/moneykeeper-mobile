import { database } from 'database/index';
import { AccountModel } from 'database/models';
import { TAccount } from 'database/types';
import { ACCOUNTS, BALANCE } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import isEqual from 'lodash/isEqual';

export type TGetAllAccountsOptions = {
  isInActive?: boolean;
  text?: string;
  excludeId?: string;
};

// --- AccountLocalQuery Class ---
export class AccountLocalQuery {
  private static instance: AccountLocalQuery;
  private accountsCollection = database.collections.get<AccountModel>(ACCOUNTS);

  private constructor() {}

  public static getInstance(): AccountLocalQuery {
    if (!AccountLocalQuery.instance) {
      AccountLocalQuery.instance = new AccountLocalQuery();
    }
    return AccountLocalQuery.instance;
  }

  /**
   * Truy vấn danh sách tài khoản
   */
  public async getAccounts({
    text = '',
    excludeId = '',
    isInActive = false,
  }: TGetAllAccountsOptions = {}) {
    const whereConditions = [
      "acc._status!='deleted'",
      excludeId ? `acc.id!='${excludeId}'` : null,
      text ? `acc.accountName LIKE '${Q.sanitizeLikeString(text)}%'` : null,
      isInActive ? `acc.isActive=${!isInActive}` : null, // Nếu isInActive là true, chỉ lấy các tài khoản không hoạt động (isActive = false)
    ]
      .filter(Boolean)
      .join(' AND ');

    // Đảm bảo có ít nhất một điều kiện để tránh lỗi SQL nếu tất cả đều null
    const finalWhereClause = whereConditions ? `WHERE ${whereConditions}` : '';

    return await database.read(async () => {
      const startTime = performance.now();
      const result = await this.accountsCollection
        .query(
          Q.experimentalJoinTables([BALANCE]),
          Q.unsafeSqlQuery(
            `WITH LatestBalance AS (
                SELECT b.id AS _id, b.accountId, b.closingAmount, b.dateRecord
                FROM ${BALANCE} b
                WHERE b.id = (
                    SELECT id FROM ${BALANCE}
                    WHERE accountId = b.accountId
                    ORDER BY dateRecord DESC, id DESC
                    LIMIT 1
                )
            )
            SELECT
                acc.id,
                acc.accountName,
                acc.accountLogo,
                acc._status,
                acc.isActive,
                acc.accountTypeId,
                acc.sortOrder,
                bal.closingAmount
            FROM ${ACCOUNTS} acc
            LEFT JOIN LatestBalance bal ON bal.accountId = acc.id
            ${finalWhereClause}
            ORDER BY acc.sortOrder ASC`,
          ),
        )
        .unsafeFetchRaw();

      const endTime = performance.now();
      console.log(`get list account: ${((endTime - startTime) / 1000).toFixed(5)} s`);
      return result;
    });
  }

  /**
   * Truy vấn tài khoản theo ID.
   */
  public async getAccountById(id: string, fields: string[] = []): Promise<TAccount | undefined> {
    return await database.read(async () => {
      const selectFields = fields.length ? fields.join(', ') : '*';
      const query = `SELECT ${selectFields} FROM ${ACCOUNTS} WHERE id='${id}' AND _status != 'deleted'`;
      const res = await this.accountsCollection.query(Q.unsafeSqlQuery(query)).unsafeFetchRaw();
      return res[0] as TAccount | undefined;
    });
  }

  /**
   * Lấy tài khoản đầu tiên đang hoạt động.
   */
  public async getFirstActiveAccount(): Promise<AccountModel | null> {
    return await database.read(async () => {
      const results = await this.accountsCollection
        .query(Q.where('_status', Q.notEq('deleted')), Q.where('isActive', true), Q.take(1))
        .fetch();
      return results[0] || null;
    });
  }

  /**
   * Thêm một tài khoản mới
   * Tính toán sortOrder tự động.
   */
  public async addAccount(accountData: Partial<TAccount>): Promise<AccountModel> {
    const queryGetMaxSortOrder = `SELECT MAX(sortOrder) AS currentSortOrder from ${ACCOUNTS} WHERE _status!='deleted'`;

    return await database.write(async () => {
      const result = await this.accountsCollection
        .query(Q.unsafeSqlQuery(queryGetMaxSortOrder))
        .unsafeFetchRaw();

      const currentMaxSortOrder = result[0]?.currentSortOrder || 0;
      const newSortOrder = currentMaxSortOrder + 1;

      const newAccount = await this.accountsCollection.create((item) => {
        Object.assign(item, {
          ...accountData,
          sortOrder: newSortOrder,
          accountName: accountData.accountName || '',
          initialAmount: accountData.initialAmount || 0,
          accountTypeId: accountData.accountTypeId || 0,
          isActive: accountData.isActive ?? true,
          isCCReminder: accountData.isCCReminder ?? false,
          creditCardReminderList: accountData.creditCardReminderList ?? '',
          creditCardStatementDay: accountData.creditCardStatementDay ?? 1,
          creditCardDayAfterStatement: accountData.creditCardDayAfterStatement ?? 0,
        });
      });
      return newAccount;
    });
  }

  /**
   * Cập nhật tài khoản hiện có
   */
  public async updateAccount({
    id,
    accountData,
  }: {
    id: string;
    accountData: Partial<TAccount>;
  }): Promise<{ isInitialAmountChanged: boolean; updatedAccount: AccountModel }> {
    return await database.write(async () => {
      const accountToUpdate = await this.accountsCollection.find(id);
      const prevInitialAmount = accountToUpdate.initialAmount;

      await accountToUpdate.update((item) => {
        Object.assign(item, {
          ...accountData,
        });
      });

      const isInitialAmountChanged = !isEqual(prevInitialAmount, accountToUpdate.initialAmount);

      return {
        isInitialAmountChanged, // Thông báo cần update Balance
        updatedAccount: accountToUpdate,
      };
    });
  }

  /**
   * Thay đổi trạng thái isActive của tài khoản theo ID.
   */
  public async changeAccountStatusById(id: string): Promise<void> {
    await database.write(async () => {
      const account = await this.accountsCollection.find(id);
      await account.update((item) => {
        item.isActive = !item.isActive;
      });
    });
  }

  /**
   * Đánh dấu một tài khoản là đã xóa (soft delete)
   */
  public async deleteAccountById(accountId: string): Promise<void> {
    return await database.write(async () => {
      const account = await this.accountsCollection.find(accountId);
      await account.markAsDeleted();
    });
  }

  /**
   * Đánh dấu tất cả các tài khoản là đã xóa (soft delete)
   */
  public async deleteAllAccounts(): Promise<void> {
    await database.write(async () => {
      await this.accountsCollection.query().markAllAsDeleted();
    });
  }
}

export const accountLocalQuery = AccountLocalQuery.getInstance();
