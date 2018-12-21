import React, { Component } from "react";
import axios from "axios";
import { timeFormat } from "d3-time-format";

class UpdateDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateDate: null,
      updateTime: null
    };
    this.jobsUrl = "https://transportation-data.austintexas.io/jobs";
    this.downloadUrl = `https://data.austintexas.gov/resource/${
      this.props.resourceId
    }`;
    if (this.props.updateEvent) {
      this.jobsUrl = `${this.jobsUrl}?name=eq.${
        this.props.updateEvent
      }&status=eq.success&order=start_date.desc&limit=1`;
    }
  }

  readableDate(date) {
    const updateDate = timeFormat("%x")(date);
    const today = timeFormat("%x")(new Date());

    if (updateDate === today) {
      return "today";
    } else {
      return updateDate;
    }
  }

  componentDidMount() {
    axios.get(this.jobsUrl).then(res => {
      if (res.data.length > 0) {
        const updateDateTime = new Date(res.data[0].start_date);

        this.setState({
          updateDate: this.readableDate(updateDateTime),
          updateTime: timeFormat("%x")(updateDateTime)
        });
      }
    });
  }

  render() {
    const { updateDate, updateTime } = this.state;
    return (
      <div className="row">
        <div className="col">
          <h6 className="dash-panel-footer-text text-left">
            {updateDate &&
              updateTime && (
                <span>{`Updated ${updateDate} at ${updateTime} | `}</span>
              )}
            <a href={this.downloadUrl} target="_blank">
              Data <i className="fa fa-download" />
            </a>
          </h6>
        </div>
      </div>
    );
  }
}

export default UpdateDate;
