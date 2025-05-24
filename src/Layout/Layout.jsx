import { useTheme } from '../context/ThemeProvider'; 
import Navbar from '../components/sidebar/Navbar';
import Footer from '../components/sidebar/Footer';

const Layout = ({ children }) => {
  const { theme} = useTheme();

  return (
    <div className={`app-layout ${theme}`}>
   
      <Navbar />
      <section id="content">
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;