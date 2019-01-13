import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import { people } from "./components/About/people";
import Profile from "./components/About/Profile";

class About extends Component {
  componentDidMount() {
    let githubUrl = "";
    axios.get(githubUrl).then(res => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <div>
          <h1>Data & Technology Services</h1>
          <h2>
            We use technology to solve real problems for real people related to
            mobility in Austin
          </h2>
          <p>
            We lauched the Data & Tech Services Team in July 2018 to establish
            department wide best practices for geospatial, application support,
            infrastructure & software engineering, and professional IT
            consulting IT.
          </p>
          <p>
            <ul>
              <li>
                We publish reliable and authoritative data and information.
              </li>
              <li>We support real-time performance measurement</li>
              <li>We empower staff and residents to find information easily</li>
              <li>We are positioned to adopt new technology quickly</li>
            </ul>
          </p>
          <p>
            Our goals are to destroy all paper & spreadsheets, make IT systems
            talk to each other, be very open, and build the best IT Team in the
            City of Austin.
          </p>
          <h1>Our Team</h1>
          {people.map((person, i) => (
            <Profile
              key={`person_${i}`}
              name={person.name}
              title={person.title}
            />
          ))}
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
