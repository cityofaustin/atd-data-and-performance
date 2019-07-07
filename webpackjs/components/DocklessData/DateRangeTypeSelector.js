import React from "react";

const DateRangeTypeSelector = ({ onDateRangeTypeSelect, displayDateRange }) => {

  return (
    <div>
      <div>
        <h5>Choose a date range</h5>
        <div className="form-group">
          <select
            className="form-control"
            id="js-date-range-type-select"
            onChange={onDateRangeTypeSelect}
          >
            <option>{displayDateRange}</option>
            <option value="month">By month</option>
            <option value="range">By date or date range</option>
            <option value="all time">All time</option>
          </select>
        </div>
      </div>
    </div>
  )
};

export default DateRangeTypeSelector;
