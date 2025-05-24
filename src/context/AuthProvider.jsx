import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenValid } from "../utils/authJson";
import { getToken, getUser, removeToken, saveToken, saveUser } from "../utils/authFuntions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token, userData) => {
    saveToken(token);
    saveUser(userData);
    setTokenValid(true);
    setCurrentUser(userData);
  };

  const logout = () => {
    setTokenValid(false);
    setCurrentUser(null);
    removeToken();
  };

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        setTokenValid(true);
      } else {
        removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      tokenValid, 
      isLoading,
      login,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return {
    ...context,
    isAuthenticated: context.tokenValid && context.currentUser !== null,
  };
};