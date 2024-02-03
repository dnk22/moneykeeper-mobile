import notifee, {
  Notification,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export interface ICreateTriggerNotification {
  timestamp: number;
  title: string;
  body: string;
  repeatFrequency: RepeatFrequency;
  id?: string;
}

export async function displayNotifications({
  title = 'Notification',
  body = 'Welcome',
  id,
}: Notification): Promise<string> {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Display a notification
  return await notifee.displayNotification({
    id,
    title,
    body,
  });
}

export async function cancel(notificationId: string) {
  await notifee.cancelNotification(notificationId);
}

export async function getAllTriggerNotifications() {
  return await notifee.getTriggerNotificationIds().then((ids) => console.log(ids, 'list noti'));
}
export async function clearAllTriggerNotifications() {
  const list = await notifee.getTriggerNotificationIds();
  return await notifee.cancelTriggerNotifications(list);
}

export async function getTriggerNotificationById(id: string) {
  return await notifee.getTriggerNotificationIds(id);
}

export async function createTriggerNotification({
  timestamp,
  title,
  body,
  repeatFrequency,
  id,
}: ICreateTriggerNotification) {
  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp, // time for notification will be fire
    alarmManager: {
      allowWhileIdle: true,
    },
    repeatFrequency,
  };
  // Create a trigger notification
  return await notifee.createTriggerNotification(
    {
      title,
      body,
      id,
    },
    trigger,
  );
}
