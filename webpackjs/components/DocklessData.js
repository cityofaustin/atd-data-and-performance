import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import MonthSelect from "./DocklessData/MonthSelect";
import PanelRowTitle from "./DocklessData/PanelRowTitle";
import CardContainer from "./DocklessData/CardContainer";
import Card from "./DocklessData/Card";

class DocklessData extends Component {
  constructor(props) {
    super(props);
    const date = new Date();

    this.state = {
      month: date.getMonth(), // default to last month
      scooterData: null,
      bicycleData: null,
      allModesData: null
    };

    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  handleMonthChange(e) {
    this.setState({ month: e.target.value });
  }

  componentDidMount() {
    const resourceId = `pqaf-uftu`;
    const allModesQuery = `select avg(trip_duration)/60 as avg_duration_minutes, sum(trip_distance) * 0.000621371 as total_miles, avg(trip_distance) * 0.000621371 as avg_miles, count(trip_id) as total_trips, date_extract_m(start_time) as month, date_extract_y(start_time) as year where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 group by year, month`;
    const dataByModeQuery = `select vehicle_type, avg(trip_duration)/60 as avg_duration_minutes, sum(trip_distance) * 0.000621371 as total_miles, avg(trip_distance) * 0.000621371 as avg_miles, count(trip_id) as total_trips, date_extract_m(start_time) as month, date_extract_y(start_time) as year where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 group by vehicle_type, year, month`;
    const dataByModeUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${dataByModeQuery}`;
    const allModesUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${allModesQuery}`;

    axios.all([axios.get(dataByModeUrl), axios.get(allModesUrl)]).then(res => {
      console.log(allModesUrl);
      console.log(dataByModeUrl);
      const dataByModeResponse = res[0].data;
      const allDataResponse = res[1].data;

      let bicycleData = _
        .filter(dataByModeResponse, o => o.vehicle_type === "bicycle")
        .reduce(function(result, item) {
          result[`${item.month}_${item.year}`] = item;
          return result;
        }, {});
      let scooterData = _
        .filter(dataByModeResponse, o => o.vehicle_type === "scooter")
        .reduce(function(result, item) {
          result[`${item.month}_${item.year}`] = item;
          return result;
        }, {});
      let allModesData = allDataResponse.reduce((result, item) => {
        result[`${item.month}_${item.year}`] = item;
        return result;
      }, {});
      this.setState({ bicycleData, scooterData, allModesData });
    });
  }

  getValue(mode, month, year, metric) {
    const modeData = `${mode}Data`;
    const monthYear = `${month}_${year}`;

    if (!this.state[modeData]) {
      return 0;
    }

    if (!this.state[modeData][monthYear]) {
      return "no data";
    }

    return Number(this.state[modeData][monthYear][metric]);
  }

  render() {
    return (
      <div className="container-fluid">
        <h2> Dockless Mobility Summary Counts </h2>
        <MonthSelect
          month={this.state.month}
          onChangeMonth={this.handleMonthChange}
        />
        <PanelRowTitle title="All Modes" />
        <CardContainer>
          <Card
            title="Total Trips"
            value={this.getValue(
              "allModes",
              this.state.month,
              2018,
              "total_trips"
            )}
            icon="mobile"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Total Miles"
            value={this.getValue(
              "allModes",
              this.state.month,
              2018,
              "total_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Average Miles"
            value={this.getValue(
              "allModes",
              this.state.month,
              2018,
              "avg_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Average Minutes"
            value={this.getValue(
              "allModes",
              this.state.month,
              2018,
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
        </CardContainer>

        <PanelRowTitle title="Dockless Scooters" />
        <CardContainer>
          <Card
            title="Scooter Trips"
            value={this.getValue(
              "scooter",
              this.state.month,
              2018,
              "total_trips"
            )}
            icon="bolt"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Total Miles"
            value={this.getValue(
              "scooter",
              this.state.month,
              2018,
              "total_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Average Miles"
            value={this.getValue(
              "scooter",
              this.state.month,
              2018,
              "avg_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Average Minutes"
            value={this.getValue(
              "scooter",
              this.state.month,
              2018,
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
        </CardContainer>

        <PanelRowTitle title="Dockless Bikes" />
        <CardContainer>
          <Card
            title="Bicycle Trips"
            value={this.getValue(
              "bicycle",
              this.state.month,
              2018,
              "total_trips"
            )}
            icon="bicycle"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Total Miles"
            value={this.getValue(
              "bicycle",
              this.state.month,
              2018,
              "total_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="Average Miles"
            value={this.getValue(
              "bicycle",
              this.state.month,
              2018,
              "avg_miles"
            )}
            icon="tachometer"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Average Minutes"
            value={this.getValue(
              "bicycle",
              this.state.month,
              2018,
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
        </CardContainer>
      </div>
    );
  }
}
export default DocklessData;
