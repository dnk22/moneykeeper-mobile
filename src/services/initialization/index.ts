import { storageService } from '../storage';
import { Initializer, InitializerDataSource } from './types';
import { BankInitializer } from './initializer/Bank';

const APP_INITIALIZED_KEY = '@app_initialized';

class AppInitService {
  private static instance: AppInitService;
  private initializers: Initializer[];

  private constructor(dataSource: InitializerDataSource) {
    // Register all initializers
    this.initializers = [new BankInitializer({ dataSource })];
  }

  public static getInstance(dataSource: InitializerDataSource): AppInitService {
    if (!AppInitService.instance) {
      AppInitService.instance = new AppInitService(dataSource);
    }
    return AppInitService.instance;
  }

  async isFirstLaunch(): Promise<boolean> {
    const initialized = storageService.getItem(APP_INITIALIZED_KEY);
    return !initialized;
  }

  async initializeApp(): Promise<void> {
    try {
      // const isFirst = await this.isFirstLaunch();
      // if (isFirst) {
      await this.initializeDefaultData();
      storageService.setItem(APP_INITIALIZED_KEY, 'true');
      // }
    } catch (error) {
      console.error('Error initializing app:', error);
      throw error;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    for (const initializer of this.initializers) {
      return await initializer.initialize();
    }
  }
}
export default AppInitService;
