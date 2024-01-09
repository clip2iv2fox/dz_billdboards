import React, { useState } from 'react';
import "./input.css"

const Input = ({placeholder, input}) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
        input(event.target.value)
    };
  
    return (
        <input
            type="text"
            id="input"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
};

export default Input;
