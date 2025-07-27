export class FirebaseError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'FirebaseError';
  }
}

export interface FirebaseResponse<T> {
  data: T | null;
  error: FirebaseError | null;
}
