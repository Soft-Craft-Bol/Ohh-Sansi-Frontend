import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/sidebar/Navbar';
import MainContent from './components/sidebar/Main';

const App = () => {
  return (
    <Router> 
      <div className="App">
        <Sidebar />
        <section id="content">
          <Navbar />
          <MainContent />
        </section>
      </div>
    </Router>
  );
};

export default App;