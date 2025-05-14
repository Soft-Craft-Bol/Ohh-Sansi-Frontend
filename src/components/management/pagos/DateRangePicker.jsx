// src/components/DateRangePicker.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DateRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      onChange({ startDate: start, endDate: end });
    }
  };

  return (
    <div className="date-range-picker">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Seleccione un rango de fechas"
        isClearable
        className="date-picker-input"
      />
    </div>
  );
};

export default DateRangePicker;