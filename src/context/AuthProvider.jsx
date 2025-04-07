import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenValid } from "../utils/authJson";
import { getToken, getUser, removeToken } from "../utils/authFuntions";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      setTokenValid(true);
      const user = getUser();
      if (user) {
        setCurrentUser(user);
      }
    } else {
      setTokenValid(false);
      setCurrentUser(null);
      removeToken(); // Limpia el token si no es válido
    }
  }, []);

  const logout = () => {
    setTokenValid(false);
    setCurrentUser(null);
    removeToken(); // Limpia el token al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ currentUser, tokenValid, logout }}>
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