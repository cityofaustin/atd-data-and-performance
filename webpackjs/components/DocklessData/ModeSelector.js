import React from "react";

const ModeSelector = ({ mode, rangeStart, rangeEnd, onModeSelect }) => (
  <div>
    {/* <div className="panel-title-row pt-2 pl-2 select-by-menu">
      <h5>Displaying data for {mode} from {rangeStart} to {rangeEnd}</h5>
    </div> */}
    <h5>Choose a device type</h5>
    <div className="form-group">
      <select
        className="form-control"
        id="js-mode-select"
        value={mode}
        onChange={onModeSelect}
      >
        <option value="all devices">All devices</option>
        <option value="scooters">Scooters</option>
        <option value="bicycles">Bicycles</option>
      </select>
    </div>
  </div>
  // <div className="row panel-title-row pt-2 pl-2">
  //   <div className="col-md-6">
  //     <div className="row form-group">
  //       <select
  //         className="form-control"
  //         id="js-mode-select"
  //         value={mode}
  //         onChange={onModeSelect}
  //       >
  //         <option value="allModes">All Modes</option>
  //         <option value="scooters">Scooters</option>
  //         <option value="bicycles">Bicycles</option>
  //       </select>
  //     </div>
  //     <div className="row">
  //       <h5>{rangeStart} to {rangeEnd}</h5>
  //     </div>
  //   </div>
  // </div>
);

export default ModeSelector;
