// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoadingIndicatorContainer } from 'components/Loading';
import { TLogin, TRegister } from 'utils/types/auth';
import { AuthResponse, fireBaseAuthService } from 'services/firebase';
import { showToast } from 'utils/system';

type TFirebaseAuthResponse = AuthResponse<FirebaseAuthTypes.UserCredential>;

export interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  appLogin: ({ email, password }: TLogin) => Promise<TFirebaseAuthResponse>;
  appSignup: ({ displayName, email, password }: TRegister) => Promise<TFirebaseAuthResponse>;
  appLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  appLogin: async ({ email, password }: TLogin): Promise<TFirebaseAuthResponse> => {
    throw new Error('Auth context not initialized');
  },
  appSignup: async ({ name, email, password }: TRegister): Promise<TFirebaseAuthResponse> => {
    throw new Error('Auth context not initialized');
  },
  appLogout: async (): Promise<TFirebaseAuthResponse> => {
    throw new Error('Auth context not initialized');
  },
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const appLogin = async ({ email, password }: TLogin) => {
    const { data, error } = await fireBaseAuthService.signInWithEmailAndPassword({
      email,
      password,
    });
    if (error) {
      showToast({
        type: 'error',
        text2: error.message,
      });
    }
    return {
      data,
      error,
    } as TFirebaseAuthResponse;
  };

  const appSignup = async ({ displayName, email, password }: TRegister) => {
    const { data, error } = await fireBaseAuthService.signUpWithEmailAndPassword({
      displayName,
      email,
      password,
    });
    if (error) {
      showToast({
        type: 'error',
        text2: error.message,
      });
    }
    return {
      data,
      error,
    } as TFirebaseAuthResponse;
  };

  const appLogout = async () => {
    const { error } = await fireBaseAuthService.signOut();
    if (error) {
      showToast({
        type: 'error',
        text2: error.message,
      });
    }
  };

  // Handle user state changes
  function handleAuthStateChanged(user: any) {
    setIsLoading(false);
    setUser(user);
  }

  useEffect(() => {
    const subscriber = fireBaseAuthService.onAuthStateChanged(handleAuthStateChanged);
    return subscriber;
  }, []);

  if (isLoading) {
    return <LoadingIndicatorContainer />;
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: !!user, appLogin, appSignup, appLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
