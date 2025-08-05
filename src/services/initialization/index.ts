import { storageService } from '../storage';
import { TInitializer, InitializerDataSource } from './types';
import { Initializer } from './initializer';

const APP_INITIALIZED_KEY = '@app_initialized';

class AppInitService {
  private static instance: AppInitService;
  private initializers: TInitializer;

  private constructor(dataSource: InitializerDataSource) {
    // Register all initializers
    this.initializers = new Initializer({ dataSource });
  }

  public static getInstance(dataSource: InitializerDataSource): AppInitService {
    if (!AppInitService.instance) {
      AppInitService.instance = new AppInitService(dataSource);
    }
    return AppInitService.instance;
  }

  // async isFirstLaunch(): Promise<boolean> {
  //   const initialized = storageService.getItem(APP_INITIALIZED_KEY);
  //   return !initialized;
  // }

  async initializeApp(): Promise<void> {
    try {
      await this.initializeDefaultData();
      storageService.setItem(APP_INITIALIZED_KEY, 'true');
    } catch (error) {
      throw error;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    await this.initializers.initialize();
  }
}
export default AppInitService;
