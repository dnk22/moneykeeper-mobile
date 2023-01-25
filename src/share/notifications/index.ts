import notifee, {
  Notification,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export interface ICreateTriggerNotification {
  timestamp: number;
  title: string;
  body: string;
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
  return await notifee.getTriggerNotifications();
}

export async function getTriggerNotificationById(id: string) {
  return await notifee.getTriggerNotificationIds(id);
}

export async function createTriggerNotification({
  timestamp,
  title,
  body,
}: ICreateTriggerNotification) {
  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp, // time for notification will be fire
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title,
      body,
    },
    trigger
  );
}
