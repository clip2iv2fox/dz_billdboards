import React from 'react'
import "./button.css"

const Button = ({ onClick, type, children }) => {
    
    return (
      <button className={`button ${type}`} onClick={onClick}>
        {children}
      </button>
    );
  };

export default Button
