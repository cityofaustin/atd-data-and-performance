import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import { people } from "./components/About/people";
import Profile from "./components/About/Profile";
import Body from "./components/About/Body";

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
          <div className="container">
            <div className="row">
              <Body />
            </div>
            <div className="row">
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
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
