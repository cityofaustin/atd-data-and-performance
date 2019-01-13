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
          <h1>People</h1>
          {people.map(person => (
            <Profile name={person.name} title={person.title} />
          ))}
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
