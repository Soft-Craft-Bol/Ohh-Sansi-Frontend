import React from "react";
import "./Header.css";

const Header = ({ title, description }) => {
  return (
    <header className="management-header">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
};

export default Header;