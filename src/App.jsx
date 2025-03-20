import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';

const App = () => {
  return (
    <Router>
      <AuthProvider>
            <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;