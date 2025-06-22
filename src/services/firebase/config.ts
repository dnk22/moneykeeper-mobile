import { initializeApp, getApp, getApps } from '@react-native-firebase/app';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Separate configs for different environments
const configs: Record<string, FirebaseConfig> = {
  development: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  production: {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
};

class FirebaseService {
  private static instance: FirebaseService;
  private app: typeof getApp;
  private environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.app = this.initializeFirebase();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private initializeFirebase(): typeof getApp {
    try {
      const config = configs[this.environment];

      // Validate config
      this.validateConfig(config);

      // Initialize Firebase if not already initialized
      if (getApps().length === 0) {
        initializeApp(config, process.env.FIREBASE_APP_ID);
      }

      return getApp;
    } catch (error) {
      throw error;
    }
  }

  private validateConfig(config: FirebaseConfig): void {
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];
    const missingFields = requiredFields.filter((field) => !config[field as keyof FirebaseConfig]);

    if (missingFields.length > 0) {
      console.log(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    }
  }

  public getFirebaseApp(): typeof getApp {
    return this.app;
  }

  public getEnvironment(): string {
    return this.environment;
  }
}

export const firebaseService = FirebaseService.getInstance();
export const firebaseApp = firebaseService.getFirebaseApp();

export const FB_PATH = {
  DEFAULT_DATA_BANKS: 'default_data/banks',
  DEFAULT_DATA_CATEGORIES: 'default_data/categories',
  USERS: 'users',
  USER_PROFILE: 'profile',
  ACCOUNTS: 'accounts',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  REPORTS: 'reports',
};
