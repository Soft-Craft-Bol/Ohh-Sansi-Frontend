import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
            <AppRoutes />
            <Toaster richColors="true"/>
      </AuthProvider>
      </BrowserRouter>
  );
};

export default App;