// src/services/notifications/AccountNotificationsService.ts (Ví dụ)

import { database } from 'database/index';
import { ACCOUNTS } from 'database/constants';
import { Q } from '@nozbe/watermelondb';
import notifee from '@notifee/react-native'; 
import { AccountModel } from 'database/models';

export class AccountNotificationsService {
  private static instance: AccountNotificationsService;
  private accountsCollection = database.collections.get<AccountModel>(ACCOUNTS);
  private creditCardAccountsSubscription: any; // Để lưu subscription

  private constructor() {}

  public static getInstance(): AccountNotificationsService {
    if (!AccountNotificationsService.instance) {
      AccountNotificationsService.instance = new AccountNotificationsService();
    }
    return AccountNotificationsService.instance;
  }

  // Khởi tạo và lắng nghe các tài khoản thẻ tín dụng
  public startObservingCreditCardAccounts(userId: string) {
    // Nếu đã có subscription, hủy nó trước
    if (this.creditCardAccountsSubscription) {
      this.creditCardAccountsSubscription.unsubscribe();
    }

    // Lắng nghe tất cả các tài khoản thẻ tín dụng của người dùng hiện tại
    // Giả sử `accountTypeId === CREDIT_CARD_TYPE_ID` là cách bạn xác định thẻ tín dụng
    const creditCardAccountsQuery = this.accountsCollection
      .query(
        Q.where('userId', userId),
        Q.where('accountTypeId', YOUR_CREDIT_CARD_ACCOUNT_TYPE_ID), // Thay bằng ID loại thẻ tín dụng của bạn
        Q.where('_status', Q.notEq('deleted')),
      )
      .observe(); // Rất quan trọng: observe()

    this.creditCardAccountsSubscription = creditCardAccountsQuery.subscribe(
      (latestCreditCardAccounts: AccountModel[]) => {
        console.log(
          'Credit card accounts changed:',
          latestCreditCardAccounts.map((acc) => acc.accountName),
        );
        // Khi có sự thay đổi, chúng ta sẽ tái tạo/cập nhật thông báo
        this.reconcileNotifications(latestCreditCardAccounts);
      },
      (error: any) => {
        console.error('Error observing credit card accounts:', error);
      },
    );
  }

  // Hàm này sẽ hủy tất cả thông báo cũ và tạo lại các thông báo mới
  // dựa trên danh sách tài khoản thẻ tín dụng hiện tại.
  private async reconcileNotifications(creditCardAccounts: AccountModel[]) {
    // 1. Hủy tất cả các thông báo thẻ tín dụng hiện có (nếu bạn muốn xóa và tạo lại)
    // notifee.cancelTriggerNotifications('category_credit_card_payment'); // Hủy theo category hoặc id cụ thể
    // Hoặc hủy từng cái bằng ID nếu bạn lưu ID thông báo
    // (Lưu ý: Bạn có thể muốn lưu ID thông báo vào WatermelonDB nếu cần quản lý chi tiết)

    // 2. Tạo hoặc cập nhật thông báo cho từng tài khoản thẻ tín dụng
    for (const account of creditCardAccounts) {
      if (
        account.isCCReminder &&
        account.creditCardStatementDay &&
        account.creditCardDayAfterStatement
      ) {
        // Tính toán ngày cần thông báo
        const notificationDate = this.calculateNotificationDate(
          account.creditCardStatementDay,
          account.creditCardDayAfterStatement,
        );

        if (notificationDate && notificationDate.getTime() > Date.now()) {
          // Chỉ lên lịch cho tương lai
          await notifee.createTriggerNotification(
            {
              id: `cc_payment_${account.id}`, // ID thông báo duy nhất cho tài khoản
              title: `Nhắc nhở thanh toán thẻ ${account.accountName}`,
              body: `Ngày đến hạn thanh toán: ${notificationDate.toLocaleDateString()}`,
              data: { accountId: account.id, type: 'credit_card_payment' },
              android: { channelId: 'default' }, // Cần tạo channel Notifee
              ios: { sound: 'default' },
            },
            {
              type: notifee.TriggerType.TIMESTAMP,
              timestamp: notificationDate.getTime(),
            },
          );
          console.log(
            `Scheduled notification for ${
              account.accountName
            } on ${notificationDate.toLocaleDateString()}`,
          );
        } else {
          // Nếu ngày đã qua hoặc không hợp lệ, hủy thông báo cũ nếu có
          await notifee.cancelNotification(`cc_payment_${account.id}`);
        }
      } else {
        // Nếu isCCReminder là false hoặc thiếu thông tin, hủy thông báo cho tài khoản này
        await notifee.cancelNotification(`cc_payment_${account.id}`);
      }
    }
  }

  // Hàm tính toán ngày thông báo dựa trên ngày sao kê và số ngày sau sao kê
  private calculateNotificationDate(statementDay: number, daysAfterStatement: number): Date | null {
    // Logic tính toán ngày thông báo thực tế (ví dụ: ngày 15 hàng tháng + 5 ngày = ngày 20)
    // Cần xử lý các trường hợp cuối tháng, chuyển năm, v.v.
    // Đây là một ví dụ đơn giản, bạn cần phát triển logic này cẩn thận.
    const today = new Date();
    let notificationDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      statementDay + daysAfterStatement,
    );

    // Nếu ngày thông báo đã qua trong tháng hiện tại, thử tính cho tháng sau
    if (notificationDate.getTime() < today.getTime()) {
      notificationDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        statementDay + daysAfterStatement,
      );
    }
    return notificationDate;
  }

  // Hủy lắng nghe khi không còn cần thiết (ví dụ: người dùng đăng xuất)
  public stopObservingCreditCardAccounts() {
    if (this.creditCardAccountsSubscription) {
      this.creditCardAccountsSubscription.unsubscribe();
      this.creditCardAccountsSubscription = null;
      console.log('Stopped observing credit card accounts.');
    }
  }
}

export const accountNotificationsService = AccountNotificationsService.getInstance();
