import React, { useState } from 'react';
import "./select.css"

const Select = ({ options, onSelect, placeholder }) => {
    const [selectedOption, setSelectedOption] = useState(placeholder);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <select className="custom-select" value={selectedOption} onChange={handleSelectChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.address}
                </option>
            ))}
        </select>
    );
};

export default Select;
