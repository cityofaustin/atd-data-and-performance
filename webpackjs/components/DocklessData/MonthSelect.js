import React from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Get the range of months starting when we first have today to this current
// month as an array of objects. Ex: [{1_2019: 'January 2019'}, ...]
const getMonthOptions = () => {
  let monthsArray = [];
  const startMonthIndex = 3; // The first month we have data is from April 2018
  const startYear = 2018;
  const today = new Date();
  const endMonthIndex = today.getMonth();
  const endYear = today.getFullYear();

  for (var year = startYear; year <= endYear; year++) {
    months.map((month, index) => {
      let isBeforeStartMonth = startMonthIndex > index && startYear === year;
      let isAfterCurrentMonth = index > endMonthIndex && endYear == year;
      if (isBeforeStartMonth || isAfterCurrentMonth) {
        return false;
      }
      monthsArray.push({ [`${index + 1}_${year}`]: `${month} ${year}` });
    });
  }
  monthsArray.push({ "0_0000" : "All time" });
  console.log(monthsArray);
  return monthsArray;
};

const MonthSelect = ({ monthYear, onChangeMonth }) => (
  <div className="form-group">
    <label htmlFor="js-month-select">Month</label>
    <select
      className="form-control"
      id="js-month-select"
      value={monthYear}
      onChange={onChangeMonth}
    >
      {getMonthOptions().map(month => (
        <option key={Object.keys(month)[0]} value={Object.keys(month)[0]}>
          {Object.values(month)[0]}
        </option>
      ))}
    </select>
  </div>
);

export default MonthSelect;
