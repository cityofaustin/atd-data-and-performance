import React, { Component } from "react";
import { render } from "react-dom";
import MicromobilityData from "./components/MicromobilityData/index";
class App extends Component {
  render() {
    return <MicromobilityData />;
  }
}
render(<App />, document.getElementById("root-MicromobilityData"));
