import { Action } from '@reduxjs/toolkit';
import notifee from '@notifee/react-native';
import { clearAllTriggerNotifications, createTriggerNotification } from 'share/notifications';
import { RepeatFrequency } from '@notifee/react-native';

export async function onAccountStatementListener(action: Action, listenerApi: any) {
  // Extract statementDate values from the data object
  const statementDates = Object.values(listenerApi.getState().account.accountStatementInfo).map(
    (item) => item.statementDate,
  );

  // Get unique statementDate date
  const uniqueStatementDates = [...new Set(statementDates)];
  // clear all notification of statement before update
  clearAllTriggerNotifications();
  const clearStatementNotiList = (await notifee.getTriggerNotificationIds()).filter((item) =>
    item.includes('statement'),
  );
  notifee.cancelTriggerNotifications(clearStatementNotiList);
  for await (const item of uniqueStatementDates) {
    const date = new Date(Date.now());
    date.setDate(item);
    date.setHours(8);
    await createTriggerNotification({
      timestamp: date.getTime(),
      title: 'Bạn có kỳ sao kê thẻ tín dụng mới',
      body: 'Kiểm tra ngay',
      repeatFrequency: RepeatFrequency.DAILY,
      id: `statement-${date.getDate().toString()}`,
    });
  }
}
