import React, { useState } from "react";
import { FaThLarge, FaChartPie, FaQuestionCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { PiClipboardTextFill } from "react-icons/pi";
import { MdOutlinePayment } from "react-icons/md";
import { signOut } from "../../utils/authFuntions";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logoOhSansi from "../../assets/img/sansi-logo-only.png";

const Sidebar = ({ isSidebarVisible }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleLogout = () => {
    signOut();
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <section id="sidebar" className={!isSidebarVisible ? "hide" : ""}>
      <Link to="/home" className="brand">
        <div className="icon">
          <img src={logoOhSansi} alt="logoOhSansi" />
        </div>
        <span className="text">Oh Sansi Olimpiadas</span>
      </Link>

      <ul className="side-menu top">
        <li className={activeMenu === "dashboard" ? "active" : ""}>
          <Link to="/home" className="link" onClick={() => handleMenuClick("dashboard")}>
            <FaThLarge className="icon" />
            <span className="text">Página Principal</span>
          </Link>
        </li>
        <li className={activeMenu === "analytics" ? "active" : ""}>
          <Link to="/form" className="link" onClick={() => handleMenuClick("analytics")}>
            <PiClipboardTextFill className="icon" />
            <span className="text">Inscripciones</span>
          </Link>
        </li>
        <li className={activeMenu === "store" ? "active" : ""}>
          <Link to="/management" className="link" onClick={() => handleMenuClick("store")}>
            <MdOutlinePayment className="icon" />
            <span className="text">Administracion de olimpiadas</span>
          </Link>
        </li>
        <li className={activeMenu === "message" ? "active" : ""}>
          <Link to="/registro-areas" className="link" onClick={() => handleMenuClick("message")}>
            <FaChartPie className="icon" />
            <span className="text">Reportes</span>
          </Link>
        </li>
        <li className={activeMenu === "team" ? "active" : ""}>
          <Link to="/inicio" className="link" onClick={() => handleMenuClick("team")}>
            <FaQuestionCircle className="icon" />
            <span className="text">Ayuda</span>
          </Link>
        </li>
      </ul>

      <ul className="side-menu">
        <li>
          <Link to="/inicio" className="link">
            <FaCog className="icon" />
            <span className="text">Configuraciones</span>
          </Link>
        </li>
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
