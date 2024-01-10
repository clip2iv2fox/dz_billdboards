import React, { useState } from 'react';

const DateInput = ({placeholder, input}) => {
    const [selectedDate, setSelectedDate] = useState(placeholder);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        input(event.target.value)
    };

    return (
        <input
            type="date"
            id="dateInput"
            value={selectedDate}
            onChange={handleDateChange}
        />
    );
};

export default DateInput;
