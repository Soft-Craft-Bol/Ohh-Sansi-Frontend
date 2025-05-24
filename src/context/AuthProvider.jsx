import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, isTokenValid, saveToken, saveUser, signOut } from '../utils/AuthUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Función para verificar la autenticación
  const checkAuth = () => {
    try {
      const token = getToken();
      const userData = getUser();
      
      if (token && isTokenValid(token) && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        // Si el token no es válido, limpiamos todo
        setIsAuthenticated(false);
        setUser(null);
        if (token && !isTokenValid(token)) {
          signOut(); // Limpiar tokens expirados
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  // Función para hacer login
  const login = (token, userData) => {
    try {
      // Guardar token y usuario usando las funciones de authUtils
      saveToken(token);
      saveUser(userData);
      
      setIsAuthenticated(true);
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  // Función para hacer logout
  const logout = () => {
    signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Función para refrescar el estado de autenticación
  const refreshAuth = () => {
    setIsLoading(true);
    checkAuth();
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    refreshAuth,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};