import React from 'react';
import "./header.css"
import logoImage from './billboard.svg'; // Укажите путь к вашему изображению

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <img className="logo" src={logoImage} alt="Логотип" />
        billboard S
      </div>
      <div className="icon">
        <img className="logo" src={logoImage} alt="Логотип" />
      </div>
    </div>
  );
};

export default Header;
