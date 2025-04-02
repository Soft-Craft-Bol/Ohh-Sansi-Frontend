import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/sidebar/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="App">
      <Sidebar />
      <section id="content">
        <Navbar />
        {children}
      </section>
    </div>
  );
};

export default Layout;