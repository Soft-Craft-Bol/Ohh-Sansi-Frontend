import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log('isAuthenticated:', isAuthenticated); 
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return children;
  };


export default PrivateRoute;