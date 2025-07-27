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

class NotifeeService {
  /**
   * Displays an immediate notification.
   * On iOS, this will also request notification permissions if not already granted.
   *
   * @param {Notification} { title, body, id } - The notification details.
   * @returns {Promise<string>} A promise that resolves with the notification ID.
   */
  public async displayNotification({
    title = 'Notification',
    body = 'Welcome',
    id,
  }: Notification): Promise<string> {
    await notifee.requestPermission(); // Required for iOS
    return await notifee.displayNotification({
      id,
      title,
      body,
    });
  }

  /**
   * Cancels a specific notification by its ID.
   *
   * @param {string} notificationId - The ID of the notification to cancel.
   * @returns {Promise<void>} A promise that resolves when the notification is canceled.
   */
  public async cancelNotification(notificationId: string): Promise<void> {
    await notifee.cancelNotification(notificationId);
  }

  /**
   * Retrieves a list of all currently scheduled trigger notification IDs.
   *
   * @returns {Promise<string[]>} A promise that resolves with an array of trigger notification IDs.
   */
  public async getAllTriggerNotificationIds(): Promise<string[]> {
    const ids = await notifee.getTriggerNotificationIds();
    return ids;
  }

  /**
   * Clears all trigger notifications whose IDs include a specific name.
   *
   * @param {string} name - The string to filter notification IDs by.
   * @returns {Promise<void>} A promise that resolves when the notifications are canceled.
   */
  public async clearTriggerNotificationsByName(name: string): Promise<void> {
    const filterList = (await notifee.getTriggerNotificationIds()).filter((item) =>
      item.includes(name),
    );
    await notifee.cancelTriggerNotifications(filterList);
  }

  /**
   * @param {string} id - The ID of the trigger notification to look for.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the ID is found, `false` otherwise.
   */
  public async getTriggerNotificationById(id: string): Promise<boolean> {
    const allTriggerIds = await notifee.getTriggerNotificationIds();
    return allTriggerIds.includes(id);
  }

  public async getTriggerNotifications(): Promise<any> {
    const allTriggerIds = await notifee.getTriggerNotificationIds();
    return allTriggerIds;
  }

  /**
   * Creates and schedules a time-based trigger notification.
   *
   * @param {ICreateTriggerNotification} { timestamp, title, body, repeatFrequency, id } - Details for the trigger notification.
   * @returns {Promise<string>} A promise that resolves with the notification ID.
   */
  public async createTriggerNotification({
    timestamp,
    title,
    body,
    repeatFrequency,
    id,
  }: ICreateTriggerNotification): Promise<string> {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp,
      alarmManager: {
        allowWhileIdle: true,
      },
      repeatFrequency,
    };

    return await notifee.createTriggerNotification(
      {
        title,
        body,
        id,
      },
      trigger,
    );
  }
}

export const notifeeService = new NotifeeService();
