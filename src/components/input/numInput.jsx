import React, { useState } from 'react'
import "./input.css"

const NumInput = ({placeholder, input, min = 1, max}) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
        input(event.target.value)
    };

    return (
        <input
            type="number"
            id="input"
            min={min}
            max={max}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
};

export default NumInput