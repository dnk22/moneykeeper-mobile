// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoadingIndicatorContainer } from 'components/Loading';
import { TLogin, TRegister } from 'utils/types/auth';
import { AuthResponse, fireBaseAuthService } from 'services/firebase';
import { showToast } from 'utils/system';
import { selectAppAuthState } from 'store/app/app.selector';
import { persistor, RootState } from 'store/index';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppAuthState, updateAppLoading } from 'store/app/app.slice';
import { clearAllData } from 'database/index';

type TFirebaseAuthResponse = AuthResponse<FirebaseAuthTypes.UserCredential>;

export interface AuthContextType {
  isLoggedIn: boolean;
  isOnboarded?: boolean;
  appLogin: ({ email, password }: TLogin) => Promise<AuthResponse<{ isOnBoard: boolean }>>;
  appSignup: ({ displayName, email, password }: TRegister) => Promise<TFirebaseAuthResponse>;
  appLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  appLogin: async ({ email, password }: TLogin): Promise<AuthResponse<{ isOnBoard: boolean }>> => {
    throw new Error('Auth context not initialized');
  },
  appSignup: async ({
    displayName,
    email,
    password,
  }: TRegister): Promise<TFirebaseAuthResponse> => {
    throw new Error('Auth context not initialized');
  },
  appLogout: async (): Promise<void> => {
    throw new Error('Auth context not initialized');
  },
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const dispatch = useDispatch();
  const [isInitializing, setInitializing] = useState(true);
  const { isLoggedIn, isOnboarded } = useSelector((state: RootState) => selectAppAuthState(state));

  const appLogin = async ({ email, password }: TLogin) => {
    try {
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
      } as AuthResponse<{ isOnBoard: boolean }>;
    } catch (error) {
      return error as AuthResponse<{ isOnBoard: boolean }>;
    }
  };

  const appSignup = async ({ displayName, email, password }: TRegister) => {
    dispatch(updateAppLoading(true));
    try {
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
    } catch (error) {
      return error as TFirebaseAuthResponse;
    } finally {
      dispatch(updateAppLoading(false));
    }
  };

  const appLogout = async () => {
    dispatch(updateAppLoading(true));
    try {
      await persistor.purge();
      await clearAllData();
      const { error } = await fireBaseAuthService.signOut();
      if (error) {
        showToast({
          type: 'error',
          text2: error.message,
        });
      }
    } catch (error) {
      return error as void;
    } finally {
      dispatch(updateAppLoading(false));
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    if (!user) {
      dispatch(
        updateAppAuthState({
          isLoggedIn: false,
          isOnboarded: false,
        }),
      );
    }
    setInitializing(false);
  }

  useEffect(() => {
    const subscriber = fireBaseAuthService.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (isInitializing) {
    return <LoadingIndicatorContainer />;
  }

  return (
    <AuthContext.Provider value={{ isOnboarded, isLoggedIn, appLogin, appSignup, appLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
