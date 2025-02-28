import { loadString, remove, saveString } from 'share/storage';

export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const getToken = () => loadString(StorageKeys.ACCESS_TOKEN);
export const getRefreshToken = () => loadString(StorageKeys.REFRESH_TOKEN);

export const setToken = (token: string) => saveString(StorageKeys.ACCESS_TOKEN, token);
export const setRefreshToken = (token: string) => saveString(StorageKeys.REFRESH_TOKEN, token);

export const removeTokens = () => {
  remove(StorageKeys.ACCESS_TOKEN);
  remove(StorageKeys.REFRESH_TOKEN);
};
