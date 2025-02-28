import database, { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import { firebaseApp } from './config';

export class DatabaseError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

class DatabaseService {
  private static instance: DatabaseService;
  private database: FirebaseDatabaseTypes.Module;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: any; timestamp: number }>;

  private constructor() {
    this.database = database(firebaseApp);
    this.cache = new Map();
    
    // Enable persistence for offline capabilities
    this.database.setPersistenceEnabled(true);
    this.database.setLoggingEnabled(process.env.NODE_ENV === 'development');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private getCacheKey(path: string, query?: object): string {
    return `${path}${query ? JSON.stringify(query) : ''}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  public async get<T>(
    path: string,
    useCache = true
  ): Promise<DatabaseResponse<T>> {
    try {
      const cacheKey = this.getCacheKey(path);
      const cached = this.cache.get(cacheKey);

      if (useCache && cached && this.isValidCache(cached.timestamp)) {
        return { data: cached.data as T, error: null };
      }

      const snapshot = await this.database.ref(path).once('value');
      const data = snapshot.val() as T;

      // Update cache
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async set(
    path: string,
    data: any
  ): Promise<DatabaseResponse<void>> {
    try {
      await this.database.ref(path).set(data);
      
      // Invalidate cache
      const cacheKey = this.getCacheKey(path);
      this.cache.delete(cacheKey);
      
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async update(
    path: string,
    updates: object
  ): Promise<DatabaseResponse<void>> {
    try {
      await this.database.ref(path).update(updates);
      
      // Invalidate cache
      const cacheKey = this.getCacheKey(path);
      this.cache.delete(cacheKey);
      
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async remove(path: string): Promise<DatabaseResponse<void>> {
    try {
      await this.database.ref(path).remove();
      
      // Invalidate cache
      const cacheKey = this.getCacheKey(path);
      this.cache.delete(cacheKey);
      
      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public onValue<T>(
    path: string,
    callback: (data: T | null) => void
  ): () => void {
    const unsubscribe = this.database
      .ref(path)
      .on('value', (snapshot) => {
        callback(snapshot.val() as T);
      });

    return () => this.database.ref(path).off('value', unsubscribe);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const databaseService = DatabaseService.getInstance();
