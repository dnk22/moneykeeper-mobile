import {
  PERMISSIONS,
  Permission,
  request,
  check,
  RESULTS,
  checkNotifications,
} from 'react-native-permissions';

type Result = 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited';

const calendars = PERMISSIONS.IOS.CALENDARS;
const reminders = PERMISSIONS.IOS.REMINDERS;
const faceId = PERMISSIONS.IOS.FACE_ID;
const photoLib = PERMISSIONS.IOS.PHOTO_LIBRARY;
const photoLibAddOnly = PERMISSIONS.IOS.PHOTO_LIBRARY;

export function checkPermission(
  permission: Permission,
  onUnAvailable?: Function,
  onDenied?: Function,
  onGranted?: Function,
  onBlocked?: Function
) {
  check(permission).then((result: Result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        /*
         This feature is not available (on this device / in this context)
         */
        onUnAvailable && onUnAvailable();
        break;
      case RESULTS.DENIED:
        /*
         The permission has not been requested / is denied but requestable
         */
        onDenied && onDenied();
        break;
      case RESULTS.GRANTED:
        /*
        The permission is granted
         */
        onGranted && onGranted();
        break;
      case RESULTS.BLOCKED:
        /*
        The permission is denied and not requestable anymore
         */
        onBlocked && onBlocked();
        break;
    }
  });
}

export async function useCalendarsPermission() {
  return await request(calendars);
}

export async function useRemindersPermission() {
  return await request(reminders);
}

export async function useFaceIdPermission() {
  return await request(faceId);
}

export async function usePhotoLibPermission() {
  return await request(photoLib);
}

export async function usePhotoLibAddOnlyPermission() {
  return await request(photoLibAddOnly);
}

export async function checkNotification() {
  const { status } = await checkNotifications();
  return status;
}
