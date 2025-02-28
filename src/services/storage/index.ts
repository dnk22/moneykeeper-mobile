import { MMKV } from 'react-native-mmkv';

class StorageService {
  private static instance: StorageService;
  private storage: MMKV;

  private constructor() {
    this.storage = new MMKV({
      id: 'app-storage',
      encryptionKey: 'your-encryption-key'
    });
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getItem(key: string): string | undefined {
    return this.storage.getString(key);
  }

  public setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  public removeItem(key: string): void {
    this.storage.delete(key);
  }

  public clearAll(): void {
    this.storage.clearAll();
  }
}

export const storageService = StorageService.getInstance();

export const reduxPersistStorage = {
  setItem: async (key: string, value: string) => {
    try {
      storageService.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },
  getItem: async (key: string) => {
    try {
      const value = storageService.getItem(key);
      return value ?? null;
    } catch (error) {
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      storageService.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
  length: 0,
  clear: () => {},
  key: (_index: number) => null
};
