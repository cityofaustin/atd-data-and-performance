import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import MonthSelect from "./MonthSelect";
import PanelRowTitle from "./PanelRowTitle";
import CardContainer from "./CardContainer";
import Card from "./Card";
import Description from "./Description";

class DocklessData extends Component {
  constructor(props) {
    super(props);
    const date = new Date();

    this.state = {
      month: date.getMonth(), // default to last month
      scooterData: null,
      bicycleData: null,
      allModesData: null,
      deviceCountData: null
    };

    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  handleMonthChange(e) {
    this.setState({ month: e.target.value });
  }

  componentDidMount() {
    const resourceId = `7d8e-dm7r`;

    const allModesQuery = `select avg(trip_duration)/60 as avg_duration_minutes, sum(trip_distance) * 0.000621371 as total_miles, avg(trip_distance) * 0.000621371 as avg_miles, count(trip_id) as total_trips, date_extract_m(start_time) as month, date_extract_y(start_time) as year where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 group by year, month`;
    const dataByModeQuery = `select vehicle_type, avg(trip_duration)/60 as avg_duration_minutes, sum(trip_distance) * 0.000621371 as total_miles, avg(trip_distance) * 0.000621371 as avg_miles, count(trip_id) as total_trips, date_extract_m(start_time) as month, date_extract_y(start_time) as year where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 group by vehicle_type, year, month`;
    const deviceCountQuery = `SELECT vehicle_type, device_id, date_extract_m(start_time) as month, date_extract_y(start_time) as year GROUP BY device_id, vehicle_type, month, year LIMIT 49999`;

    const dataByModeUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${dataByModeQuery}`;
    const allModesUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${allModesQuery}`;
    const deviceCountUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${deviceCountQuery}`;

    axios
      .all([
        axios.get(dataByModeUrl),
        axios.get(allModesUrl),
        axios.get(deviceCountUrl)
      ])
      .then(res => {
        console.log(allModesUrl);
        console.log(dataByModeUrl);
        console.log(deviceCountUrl);
        const dataByModeResponse = res[0].data;
        const allDataResponse = res[1].data;
        const deviceDataResponse = res[2].data;

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

        // TODO: There must be a better way to get device counts by vehicle_type
        // & month, but the best I could do was iterate through all devices and
        // sort them into a nested object manually.
        let deviceCountData = { scooter: {}, bicycle: {} };
        deviceDataResponse.forEach(item => {
          // skip values that don't have vehicle_type
          if (typeof item.vehicle_type === "undefined") {
            return false;
          }
          // if its the first device count for a month, start at 1
          if (
            typeof deviceCountData[item.vehicle_type][
              `${item.month}_${item.year}`
            ] === "undefined"
          ) {
            deviceCountData[item.vehicle_type][
              `${item.month}_${item.year}`
            ] = 1;
          } else {
            // else iterate up by one for the count
            deviceCountData[item.vehicle_type][`${item.month}_${item.year}`] =
              deviceCountData[item.vehicle_type][`${item.month}_${item.year}`] +
              1;
          }
        });
        console.log(deviceCountData);

        this.setState({
          bicycleData,
          scooterData,
          allModesData,
          deviceCountData
        });
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

  getDeviceValue(mode, month, year) {
    const { deviceCountData } = this.state;

    // return 0 when the API hasn't responded yet but the HTML needs to render
    if (!deviceCountData) {
      return 0;
    }

    const scooterDataByMonth = deviceCountData.scooter[`${month}_${year}`];
    const bicycleDataByMonth = deviceCountData.bicycle[`${month}_${year}`];

    if (mode === "allModes") {
      // if both modes are undefined, don't try to sum them to return NaN.
      if (
        typeof scooterDataByMonth === "undefined" &&
        typeof bicycleDataByMonth === "undefined"
      ) {
        return "no data";
      }

      // else sum the modes
      return (scooterDataByMonth || 0) + (bicycleDataByMonth || 0);
    } else {
      // for mode specific data cards, make sure the mode data and month data
      // are present in state
      if (
        !deviceCountData[mode] ||
        typeof deviceCountData[mode][`${month}_${year}`] === "undefined"
      ) {
        return "no data";
      } else {
        return deviceCountData[mode][`${month}_${year}`];
      }
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <h2> Dockless Mobility Summary Counts </h2>
        <Description />

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
          <Card
            title="Total Devices"
            value={this.getDeviceValue("allModes", this.state.month, 2018)}
            icon="star"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
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
          <Card
            title="Total Devices"
            value={this.getDeviceValue("scooter", this.state.month, 2018)}
            icon="star"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
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
          <Card
            title="Total Devices"
            value={this.getDeviceValue("bicycle", this.state.month, 2018)}
            icon="star"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
        </CardContainer>
      </div>
    );
  }
}
export default DocklessData;
