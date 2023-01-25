import { isPassedDate } from 'utils/date';
import { PayloadAction } from '@reduxjs/toolkit';
import { TCountDown } from 'features/CountDown/type';
import { createTriggerNotification } from 'share/notifications';

export async function onAddOrUpdateCountDown({
  payload,
}: PayloadAction<TCountDown>) {
  const { name, alerts, targetDateTime } = payload;
  if (!isPassedDate(targetDateTime)) {
    // config alarm when date fire
    const timestamp = new Date(targetDateTime).getTime();
    await createTriggerNotification({
      timestamp,
      title: name,
      body: `${name} đã đến.`,
    });
    // config alarm for alert soon ( eg : 15m before date fire )
    if (alerts) {
    }
  }
}
