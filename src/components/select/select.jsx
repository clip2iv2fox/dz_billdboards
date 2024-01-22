import React, { useEffect, useState } from 'react';
import "./select.css"

const Select = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(options.length !== 0 ? options[0].id : "");

    useEffect(() => {
        onSelect(selectedOption);
    }, []);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <select className="custom-select" value={selectedOption ? selectedOption.id : ''} onChange={handleSelectChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.address}
                </option>
            ))}
        </select>
    );
};

export default Select;
