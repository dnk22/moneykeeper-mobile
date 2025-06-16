// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { authService } from '.';
import AppLoading from 'features/common/AppLoading';
import { LoadingIndicatorContainer } from 'components/Loading';

export interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  appLogin: (email: string, password: string) => Promise<void>;
  appSignup: (email: string, password: string) => Promise<void>;
  appLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  appLogin: async () => {},
  appSignup: async () => {},
  appLogout: async () => {},
});
export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle user state changes
  function handleAuthStateChanged(user: any) {
    setIsLoading(false);
    setUser(user);
  }

  const appLogin = async (email: string, password: string) => {
    try {
      await authService.firebaseSignIn({ email, password });
    } catch (error) {
      throw error;
    }
  };

  const appSignup = async (email: string, password: string) => {
    try {
      await authService.firebaseSignUp({ email, password });
    } catch (error) {
      throw error;
    }
  };

  const appLogout = async () => {
    try {
      await authService.firebaseSignOut();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber;
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    appLogin,
    appSignup,
    appLogout,
  };

  if (isLoading) {
    return <LoadingIndicatorContainer />;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
