import React , {useEffect, useState}from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, tokenValid } = useAuth();
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      if (isAuthenticated || !tokenValid) {
        setIsLoading(false);  
      }
    }, [isAuthenticated, tokenValid]);
  
    if (isLoading) {
      return <div>Loading...</div>;  
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
  };


export default PrivateRoute;