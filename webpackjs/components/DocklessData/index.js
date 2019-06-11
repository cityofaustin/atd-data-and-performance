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
    const thisMonth = date.getMonth() + 1;
    const defaultYear = date.getFullYear();
    const lastDay = this.getDaysInMonth(`${thisMonth}`, `${defaultYear}`);
    const monthYear = `'${defaultYear}-${thisMonth}-1' and '${defaultYear}-${thisMonth}-${lastDay}T23:59:59.999'`;

    this.state = {
      monthYear: monthYear,
      scooterData: null,
      bicycleData: null,
      allModesData: null,
      deviceCountData: null,
      threeOneOneData: null,
      dataIsLoaded: false
    };

    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  handleMonthChange(e) {
    const monthYear = e.target.value;
    this.setState({
      monthYear: monthYear,
      dataIsLoaded: false,
    });
    this.runQueries(monthYear);
  }

  runQueries(monthYear) {
    const dateQuery = monthYear;

    const resourceId = `7d8e-dm7r`;
    const resourceId311 = `5h38-fd8d`;
    const tripSelectors = `avg(trip_duration)/60 as avg_duration_minutes, sum(trip_distance) * 0.000621371 as total_miles, avg(trip_distance) * 0.000621371 as avg_miles, count(trip_id) as total_trips`;
    const tripFilters =  `trip_distance * 0.000621371 >= 0.1 AND trip_distance * 0.000621371 < 500 AND trip_duration < 86400`;

    const dataByModeQuery = `SELECT vehicle_type, ${tripSelectors} WHERE start_time between ${dateQuery} AND ${tripFilters} GROUP BY vehicle_type`;
    const allModesQuery = `SELECT ${tripSelectors} WHERE start_time between ${dateQuery} AND ${tripFilters}`;
    const deviceCountScooterQuery = `SELECT DISTINCT device_id WHERE start_time between ${dateQuery} AND vehicle_type = 'scooter' LIMIT 1000000000`;
    const deviceCountBicycleQuery = `SELECT DISTINCT device_id WHERE start_time between ${dateQuery} AND vehicle_type = 'bicycle' LIMIT 1000000000`;
    const threeOneOneQuery = `SELECT count(sr_type_code) as count WHERE sr_created_date between ${dateQuery} AND sr_type_code == "DOCKMOBI"`;

    const dataByModeUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${dataByModeQuery}`;
    const allModesUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${allModesQuery}`;
    const deviceCountScooterUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${deviceCountScooterQuery}`;
    const deviceCountBicycleUrl = `https://data.austintexas.gov/resource/${resourceId}.json?$query=${deviceCountBicycleQuery}`;
    const threeOneOneUrl = `https://data.austintexas.gov/resource/${resourceId311}.json?$query=${threeOneOneQuery}`;

    axios
      .all([
        axios.get(dataByModeUrl),
        axios.get(allModesUrl),
        axios.get(deviceCountScooterUrl),
        axios.get(deviceCountBicycleUrl),
        axios.get(threeOneOneUrl)
      ])
      .then(res => {
        const dataByModeResponse = res[0].data;
        const allDataResponse = res[1].data;
        const deviceScooterDataResponse = res[2].data;
        const deviceBicycleDataResponse = res[3].data;
        const threeOneOneResponse = res[4].data;

        let bicycleData = _.filter(
          dataByModeResponse,
          o => o.vehicle_type === "bicycle"
        )[0];
        let scooterData = _.filter(
          dataByModeResponse,
          o => o.vehicle_type === "scooter"
        )[0];
        let allModesData = allDataResponse[0];
        let threeOneOneData = threeOneOneResponse[0];
        let deviceCountData = {
          scooter: deviceScooterDataResponse.length,
          bicycle: deviceBicycleDataResponse.length
        };

        this.setState({
          bicycleData,
          scooterData,
          allModesData,
          deviceCountData,
          threeOneOneData,
          dataIsLoaded: true
        });
      });
  }

  componentDidMount() {
    this.runQueries(this.state.monthYear);
  }

  getValue(data, metric) {
    const leData = `${data}`;

    // return 0 when the API hasn't responded yet but the HTML needs to render
    if (!this.state[leData] || this.state.dataIsLoaded === false) {
      return 0;
    }

    return Number(this.state[leData][metric]);
  }

  getDeviceValue(mode) {
    const { deviceCountData } = this.state;

    // return 0 when the API hasn't responded yet but the HTML needs to render
    if (!deviceCountData || this.state.dataIsLoaded === false) {
      return 0;
    }

    const scooterData = deviceCountData.scooter;
    const bicycleData = deviceCountData.bicycle;

    if (mode === "all") {
      return (scooterData || 0) + (bicycleData || 0);
    } else {
      return deviceCountData[mode]
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <h2>Dockless Mobility Overview</h2>
        <MonthSelect
          monthYear={this.state.monthYear}
          onChangeMonth={this.handleMonthChange}
        />
        {this.state.dataIsLoaded ? (
          ""
        ) : (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw mt-2 mb-4" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <PanelRowTitle title="All Modes" />
        <CardContainer>
          <Card
            title="Total Trips"
            value={this.getValue(
              "allModesData",
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
              "allModesData",
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
              "allModesData",
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
              "allModesData",
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Total Devices"
            value={this.getDeviceValue(
              "all",
            )}
            icon="star"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
          <Card
            title="311 Service Requests"
            value={this.getValue(
              "threeOneOneData",
              "count"
            )}
            icon="phone"
            resourceId={"5h38-fd8d"}
            numberFormat="thousands"
          />
        </CardContainer>

        <PanelRowTitle title="Dockless Scooters" />
        <CardContainer>
          <Card
            title="Scooter Trips"
            value={this.getValue(
              "scooterData",
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
              "scooterData",
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
              "scooterData",
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
              "scooterData",
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Total Devices"
            value={this.getDeviceValue(
              "scooter",
            )}
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
              "bicycleData",
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
              "bicycleData",
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
              "bicycleData",
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
              "bicycleData",
              "avg_duration_minutes"
            )}
            icon="hourglass"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="decimal"
          />
          <Card
            title="Total Devices"
            value={this.getDeviceValue(
              "bicycle",
            )}
            icon="star"
            resourceId={"7d8e-dm7r"}
            updateEvent="dockless_trips"
            numberFormat="thousands"
          />
        </CardContainer>
        <h3 className="mt-3">About</h3>
        <Description />
      </div>
    );
  }
}
export default DocklessData;
