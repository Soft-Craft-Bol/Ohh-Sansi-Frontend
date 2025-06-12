import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';

const App = () => {

  return (
    <BrowserRouter>
      <ThemeProvider><AuthProvider>

        <AppRoutes />

      </AuthProvider></ThemeProvider>
    </BrowserRouter>
  );
};

export default App;