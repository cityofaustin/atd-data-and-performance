import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import { people } from "./components/About/people";

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
            <div>
              <h4>{person.name}</h4>
              <h5>{person.title}</h5>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
