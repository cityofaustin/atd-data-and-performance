import React, { Component } from "react";
import { render } from "react-dom";
import DocklessData from "./components/DocklessData/index";
class App extends Component {
  render() {
    return <DocklessData />;
  }
}
render(<App />, document.getElementById("root-DocklessData"));
