import React, { useState, useEffect } from "react";
import { FaThLarge, FaChartPie, FaQuestionCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { PiClipboardTextFill } from "react-icons/pi";
import { MdOutlinePayment } from "react-icons/md";
import { signOut } from "../../utils/authFuntions";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logoOhSansi from "../../assets/img/sansi-logo-only.png";

const Sidebar = ({ isSidebarVisible }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const location = useLocation();

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/home") {
      setActiveMenu("dashboard");
    } else if (currentPath === "/form") {
      setActiveMenu("analytics");
    } else if (currentPath === "/management") {
      setActiveMenu("store");
    } else if (currentPath === "/registro-areas") {
      setActiveMenu("message");
    } else if (currentPath === "/inicio") {
      setActiveMenu("team");
    }
  }, [location]);

  return (
    <section id="sidebar" className={!isSidebarVisible ? "hide" : ""}>
      <Link to="/home" className="brand">
        <div className="icon">
          <img src={logoOhSansi} alt="logoOhSansi" />
        </div>
        <span className="text">Oh Sansi Olimpiadas</span>
      </Link>

      <ul className="side-menu top">
        {/* <li className={activeMenu === "dashboard" ? "active" : ""}>
          <Link to="/home" className="link">
            <FaThLarge className="icon" />
            <span className="text">Página Principal</span>
          </Link>
        </li> */}
        <li className={activeMenu === "analytics" ? "active" : ""}>
          <Link to="/form" className="link">
            <PiClipboardTextFill className="icon" />
            <span className="text">Inscripciones</span>
          </Link>
        </li>
        <li className={activeMenu === "store" ? "active" : ""}>
          <Link to="/management" className="link">
            <MdOutlinePayment className="icon" />
            <span className="text">Administracion de olimpiadas</span>
          </Link>
        </li>
        {/* <li className={activeMenu === "message" ? "active" : ""}>
          <Link to="/registro-areas" className="link">
            <FaChartPie className="icon" />
            <span className="text">Reportes</span>
          </Link>
        </li>
        <li className={activeMenu === "team" ? "active" : ""}>
          <Link to="/inicio" className="link">
            <FaQuestionCircle className="icon" />
            <span className="text">Ayuda</span>
          </Link>
        </li> */}
      </ul>

      <ul className="side-menu">
        {/* <li>
          <Link to="/inicio" className="link">
            <FaCog className="icon" />
            <span className="text">Configuraciones</span>
          </Link>
        </li> */}
        <li>
          <button onClick={handleLogout} className="logout">
            <FaSignOutAlt className="icon" />
            <span className="text">Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
