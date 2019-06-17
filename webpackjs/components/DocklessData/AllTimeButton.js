import React from "react";

const allTimeSelect = ( getDaysInMonth ) => {
    const today = new Date();
    const endMonthIndex = today.getMonth();
    const endYear = today.getFullYear();
    const lastDay = getDaysInMonth(`${endMonthIndex + 1}`, `${endYear}`);
    const allTimeRange = `'2018-4-1' and '${endYear}-${endMonthIndex + 1}-${lastDay}T23:59:59.999'`
    return allTimeRange;
}

const AllTimeButton = ({ getDaysInMonth, onClickAllTime }) => (
    <div className="d-flex justify-content-center">
        <button
            type="button"
            className="btn btn-primary"
            id="js-all-time-button"
            value={allTimeSelect(getDaysInMonth)}
            onClick={onClickAllTime}
            >
            All Time
        </button>
    </div>
)

export default AllTimeButton;