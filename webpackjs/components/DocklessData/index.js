import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";

import MonthSelect from "./MonthSelect";
import DateRangeSelect from "./DateRangeSelect";
import AllTimeButton from "./AllTimeButton";
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
      dateQuery: monthYear,
      startDateConverted: null,
      endDateConverted: null,
      viewDataBy: null,
      viewMode: "allModes",
      newDataView: false,
      scooterData: null,
      bicycleData: null,
      allModesData: null,
      deviceCountData: null,
      threeOneOneData: null,
      dataIsLoaded: false
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.dataViewSelect = this.dataViewSelect.bind(this);
    this.modeSelect = this.modeSelect.bind(this);
  }

  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  handleQueryChange(event) {
    let dateQuery;
    // Accept dateQuery whether it is event or simple value using logical statement
    // Note: DateRangeSelect component sends query as simple value, other components send as event
    if (event.target) {
      dateQuery = event.target.value;
    } else {
      dateQuery = event;
    }
    console.log(dateQuery);
    this.setState({
      dateQuery: dateQuery,
      dataIsLoaded: false,
    });
    this.runQueries(dateQuery);
  }

  convertDate(dateQuery) {
    const splitDate = dateQuery.split(" and ");
    const startDateRaw = splitDate[0];
    const endDateRaw = splitDate[1];
    const startDateCloseQuoteIndex = startDateRaw.lastIndexOf("'");
    const startDateNumbers = startDateRaw.slice(1, startDateCloseQuoteIndex);
    const endDateTIndex = endDateRaw.indexOf("T");
    const endDateNumbers = endDateRaw.slice(1, endDateTIndex);
    const startDateFormatted = new Date(startDateNumbers);
    const startDateString = startDateFormatted.toDateString();
    const endDateFormatted = new Date(endDateNumbers);
    const endDateString = endDateFormatted.toDateString();
    console.log(startDateString, endDateString);
    this.setState({
      startDateConverted: startDateString,
      endDateConverted: endDateString
    });
  }

  runQueries(dateQuery) {

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
          dataIsLoaded: true,
          viewDataBy: null,
          viewMode: "allModes",
          newDataView: false,
        });
      });
    this.convertDate(dateQuery);
  }

  componentDidMount() {
    this.runQueries(this.state.dateQuery);
  }

  dataViewSelect(event) {
    // Accept dataViewSelect whether it is event or simple value using logical statement
    // Note: AllTimeButton component sends query as simple value, other components send as event
    let viewDataBy;
    if (event.target) {
      viewDataBy = event.target.value;
    } else {
      viewDataBy = event;
    }
    console.log(viewDataBy)
    this.setState({
      viewDataBy: viewDataBy,
      newDataView: true
    })
  }

  modeSelect(event) {
    const viewMode = event.target.value
    console.log(viewMode);
    this.setState({
      viewMode: viewMode
    })
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

        {this.state.dataIsLoaded ? (

          <div>
            <h5 className="d-flex justify-content-center">Choose date range</h5>
            <div className="btn-group d-flex justify-content-center select-by-menu" role="group">
              <button type="button" className="btn btn-primary" value="month" onClick={this.dataViewSelect}>Month</button>
              <button type="button" className="btn btn-primary" value="range" onClick={this.dataViewSelect}>Calendar</button>
              <AllTimeButton
                getDaysInMonth={this.getDaysInMonth}
                onClickAllTime={this.handleQueryChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw mt-2 mb-4" />
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {this.state.dataIsLoaded && this.state.viewDataBy === "month" ? (
          <MonthSelect
            monthYear={this.state.dateQuery}
            getDaysInMonth={this.getDaysInMonth}
            onChangeMonth={this.handleQueryChange}
          />
        ) : (
          <div>
          </div>
        )}

        {this.state.dataIsLoaded && this.state.viewDataBy === "range" ? (
          <DateRangeSelect
            onChangeRange={this.handleQueryChange}
          />
        ) : (
          <div>
          </div>
        )}

        {this.state.newDataView ? (
          <div>
          </div>
        ) : (
          <div>
            <PanelRowTitle
              mode={this.state.viewMode}
              rangeStart={this.state.startDateConverted}
              rangeEnd={this.state.endDateConverted}
              onModeSelect={this.modeSelect}
            />
          </div>
        )}

        {this.state.newDataView === false && this.state.viewMode === "allModes" ? (
          <div>
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
          </div>    
        ) : (
          <div>
          </div>
        )}

        {this.state.newDataView === false && this.state.viewMode === "scooters" ? (
          <div>
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
          </div>    
        ) : (
          <div>
          </div>
        )}

        {this.state.newDataView === false && this.state.viewMode === "bicycles" ? (
          <div>
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
          </div>    
        ) : (
          <div>
          </div>
        )}

        {this.state.newDataView ? (
          <div>
          </div>
        ) : (
          <div>
            <h3 className="mt-3">About</h3>
            <Description /> 
          </div>
        )}

      </div>
    );
  }
}
export default DocklessData;
