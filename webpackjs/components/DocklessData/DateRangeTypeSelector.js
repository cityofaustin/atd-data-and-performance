import React from "react";

const DateRangeTypeSelector = ({ onDateRangeTypeSelect, dateRangeChosen, rangeStart, rangeEnd }) => {

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
            <option>{rangeStart} to {rangeEnd}</option>
            <option value="month">Specific month</option>
            <option value="range">Specific date or date range</option>
            <option value="all time">All time</option>
          </select>
        </div>
      </div>
    </div>
  )
};

export default DateRangeTypeSelector;
