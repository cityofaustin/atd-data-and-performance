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

// To do: Pass getDaysInMonth function in to this component from index.js
// as a prop instead of defining it in both places.
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
}
// Get the range of months starting when we first have today to this current
// month as an array of objects. Ex: [{1_2019: 'January 2019'}, ...]
const getMonthOptions = () => {
  let monthsArray = [];
  const startMonthIndex = 3; // The first month we have data is from April 2018
  const startYear = 2018;
  const today = new Date();
  const endMonthIndex = today.getMonth();
  const endYear = today.getFullYear();
  let lastDay;

  for (var year = startYear; year <= endYear; year++) {
    months.map((month, index) => {
      let isBeforeStartMonth = startMonthIndex > index && startYear === year;
      let isAfterCurrentMonth = index > endMonthIndex && endYear == year;
      if (isBeforeStartMonth || isAfterCurrentMonth) {
        return false;
      }
      lastDay = getDaysInMonth(`${index + 1}`, `${year}`);
      const monthRange = `'${year}-${index + 1}-1' and '${year}-${index + 1}-${lastDay}T23:59:59.999'`;
      monthsArray.push({ [`${monthRange}`]: `${month} ${year}` });
    });
  }

  // To do: Create an "All time" (button) component and move this code to it.
  lastDay = getDaysInMonth(`${endMonthIndex + 1}`, `${endYear}`);
  const allTimeRange = `'2018-4-1' and '${endYear}-${endMonthIndex + 1}-${lastDay}T23:59:59.999'`
  monthsArray.push({ [allTimeRange] : "All time" });
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
