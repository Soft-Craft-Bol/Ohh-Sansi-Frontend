import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/sidebar/Navbar';
import MainContent from './components/sidebar/Main';

const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <section id="content">
        <Navbar />
        <MainContent />
      </section>
    </div>
  );
};

export default App;