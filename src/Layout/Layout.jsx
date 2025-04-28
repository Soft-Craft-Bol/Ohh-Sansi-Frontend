import React from 'react';
import Navbar from '../components/sidebar/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <section id="content" style={{ paddingTop: '60px' }}>
        {children}
      </section>
    </div>
  );
};

export default Layout;
