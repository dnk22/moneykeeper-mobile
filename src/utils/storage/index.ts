import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;
