// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '.';

export const AuthContext = createContext<{ isLoggedIn: null | boolean }>({ isLoggedIn: null });

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await authService.hasValidAccessToken();
      setIsLoggedIn(token);
    };

    checkLoginStatus();
  });

  return <AuthContext.Provider value={{ isLoggedIn }}>{children}</AuthContext.Provider>;
};
