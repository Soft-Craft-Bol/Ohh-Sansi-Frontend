import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <Router>
      <AuthProvider>
            <AppRoutes />
            <Toaster richColors="true"/>
      </AuthProvider>
    </Router>
  );
};

export default App;