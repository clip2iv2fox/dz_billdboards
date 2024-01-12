import React, { useState } from 'react';

const DateInput = ({ placeholder, input, min = null }) => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(placeholder);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        input(event.target.value);
    };

    return (
        <input
            type="date"
            id="dateInput"
            value={selectedDate}
            onChange={handleDateChange}
            min={min ? min : today}
        />
    );
};

export default DateInput;
