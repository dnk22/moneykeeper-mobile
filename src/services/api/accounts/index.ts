import { ACCOUNTS, TRANSACTIONS } from 'database/constants';
import { SyncQueueAction } from 'database/models/syncQueue.model';
import { transactionLocalQuery } from 'database/querying';
import { accountLocalQuery, balanceLocalQuery, syncQueueLocalQuery } from 'database/querying';
import { TAccount } from 'database/types';
import { accountsFb } from 'services/firebase/db/accounts';
import { transactionsFb } from 'services/firebase/db/transactions';

/**
 * Hàm xử lý thêm mới hoặc cập nhật tài khoản
 * @param account - Đối tượng tài khoản cần thêm/cập nhật
 *
 * Luồng xử lý:
 * 1. Nếu có ID (cập nhật):
 *    - Cập nhật thông tin tài khoản trong local DB
 *    - Nếu số dư ban đầu thay đổi, cập nhật bảng Balance
 *    - Đồng bộ lên Firebase, nếu thất bại thì lưu vào SyncQueue
 *
 * 2. Nếu không có ID (thêm mới):
 *    - Thêm tài khoản mới vào local DB
 *    - Tạo bản ghi Balance mới với số dư ban đầu
 *    - Đồng bộ lên Firebase, nếu thất bại thì lưu vào SyncQueue
 */
export async function requestUpdateAccount(account: TAccount): Promise<void> {
  const id = account.id;
  try {
    // update
    if (id) {
      const accountUpdates = { ...account };
      delete accountUpdates.id;

      const { isInitialAmountChanged, updatedAccount } = await accountLocalQuery.updateAccount({
        id: id,
        accountData: accountUpdates,
      });

      // nếu isInitialAmountChanged thay đổi, xử lý logic liên quan đến Balance
      if (isInitialAmountChanged) {
        await balanceLocalQuery.updateBalance({
          accountId: updatedAccount.id,
          openAmount: updatedAccount.initialAmount,
          closingAmount: updatedAccount.initialAmount,
        });
      }

      // Sync to firebase
      await accountsFb.updateAccount({ account: updatedAccount._raw }).catch(async (error) => {
        await syncQueueLocalQuery.updateSyncQueueItem({
          recordId: updatedAccount.id,
          payload: updatedAccount._raw,
          tableName: ACCOUNTS,
          action: SyncQueueAction.UPDATE,
        });
      });
    } else {
      // create
      await accountLocalQuery.addAccount(account).then(async (newAccount) => {
        await balanceLocalQuery.addNewBalance({
          accountId: newAccount.id,
          openAmount: newAccount.initialAmount,
          closingAmount: newAccount.initialAmount,
        });

        // Sync to firebase
        await accountsFb.addNewAccount({ account: newAccount._raw }).catch(async (error) => {
          await syncQueueLocalQuery.updateSyncQueueItem({
            recordId: newAccount.id,
            payload: newAccount._raw,
            tableName: ACCOUNTS,
            action: SyncQueueAction.CREATE,
          });
        });
      });
    }
  } catch (error: any) {
    console.log(error, 'update account err');
    throw error;
  }
}

/**
 * Hàm xử lý xóa tài khoản và các giao dịch liên quan
 * @param accountId - ID của tài khoản cần xóa
 *
 * Luồng xử lý:
 * 1. Xóa tài khoản trong local DB
 * 2. Xóa tất cả giao dịch liên quan đến tài khoản
 * 3. Tính toán lại số dư cho các tài khoản khác có liên quan
 * 4. Đồng bộ lên Firebase:
 *    - Xóa tài khoản trên Firebase
 *    - Xóa các giao dịch liên quan trên Firebase
 *    - Nếu thất bại, lưu vào SyncQueue để xử lý sau
 */
export async function requestDeleteAccount(accountId: string) {
  try {
    let transactionIdsToDelete: string[] = [];
    await accountLocalQuery.deleteAccountById(accountId);
    await transactionLocalQuery
      .clearTransactionsForAccount(accountId)
      .then(
        async ({
          accountBalanceRecalculation,
          transactionIds,
        }: {
          accountBalanceRecalculation: { accountId: string; recordAt: number }[];
          transactionIds: string[];
        }) => {
          transactionIdsToDelete = transactionIds;
          if (accountBalanceRecalculation.length) {
            // tính toán lại các account balance
            const accountCalc = accountBalanceRecalculation.filter(
              (item) => item.accountId !== accountId,
            );
            for await (const { accountId, recordAt } of accountCalc) {
              await balanceLocalQuery.calculateAllBalanceAfterDate({
                accountId,
                date: recordAt,
              });
            }
          }
        },
      );
    // sync to firebase
    // xóa account
    await accountsFb.deleteAccountById(accountId).catch(async (error) => {
      await syncQueueLocalQuery.updateSyncQueueItem({
        recordId: accountId,
        tableName: ACCOUNTS,
        action: SyncQueueAction.DELETE,
      });
    });

    // xóa các transaction liên quan tới accountId
    if (transactionIdsToDelete.length > 0) {
      await transactionsFb.deleteTransactions(transactionIdsToDelete).catch(async (error) => {
        await syncQueueLocalQuery.updateSyncQueueItem({
          recordId: accountId,
          tableName: TRANSACTIONS,
          payload: transactionIdsToDelete.toString(),
          action: SyncQueueAction.DELETE,
        });
      });
    }
  } catch (error) {
    console.log(error, 'delete account err');
    throw error;
  }
}

/**
 * Hàm thay đổi trạng thái của tài khoản theo ID
 * @param id - ID của tài khoản cần thay đổi trạng thái
 * @returns Promise trả về kết quả sau khi thay đổi trạng thái tài khoản trong local DB
 */
export async function changeAccountStatusById(account: TAccount) {
  const updatedAccount = {
    ...account,
    isActive: !account.isActive,
  };
  if (!updatedAccount?.id) {
    return;
  }
  try {
    await accountLocalQuery.changeAccountStatusById(updatedAccount.id);
    await accountsFb
      .updateAccount({
        account: updatedAccount,
      })
      .catch(async (error) => {
        if (updatedAccount?.id) {
          await syncQueueLocalQuery.updateSyncQueueItem({
            recordId: updatedAccount.id,
            tableName: TRANSACTIONS,
            payload: updatedAccount,
            action: SyncQueueAction.UPDATE,
          });
        }
      });
  } catch (error) {
    throw error;
  }
}
