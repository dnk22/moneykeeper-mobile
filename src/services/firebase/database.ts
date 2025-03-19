import { FirebaseDatabaseTypes, getDatabase } from '@react-native-firebase/database';

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

  private constructor() {
    this.database = getDatabase();
    // Enable persistence for offline capabilities
    this.database.setPersistenceEnabled(true);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async get<T>(path: string): Promise<DatabaseResponse<T>> {
    try {
      const snapshot = await this.database.ref(path).once('value');
      const data = snapshot.val() as T;

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async set(path: string, data: any): Promise<DatabaseResponse<void>> {
    try {
      await this.database.ref(path).set(data);

      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public async update(path: string, updates: object): Promise<DatabaseResponse<void>> {
    try {
      await this.database.ref(path).update(updates);

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

      return { data: undefined, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: new DatabaseError(error.code || 'unknown', error.message),
      };
    }
  }

  public onValue<T>(path: string, callback: (data: T | null) => void): () => void {
    const unsubscribe = this.database.ref(path).on('value', (snapshot) => {
      callback(snapshot.val() as T);
    });

    return () => this.database.ref(path).off('value', unsubscribe);
  }
}

export const databaseService = DatabaseService.getInstance();
