import React from "react";

const MonthSelect = ({ month, onChangeMonth }) => (
  <div className="form-group">
    <label htmlFor="js-month-select">Month</label>
    <select
      className="form-control"
      id="js-month-select"
      value={month}
      onChange={onChangeMonth}
    >
      <option value="1">January 2018</option>
      <option value="2">February 2018</option>
      <option value="3">March 2018</option>
      <option value="4">April 2018</option>
      <option value="5">May 2018</option>
      <option value="6">June 2018</option>
      <option value="7">July 2018</option>
      <option value="8">August 2018</option>
      <option value="9">September 2018</option>
      <option value="10">October 2018</option>
      <option value="11">November 2018</option>
      <option value="12">December 2018</option>
    </select>
  </div>
);

export default MonthSelect;
