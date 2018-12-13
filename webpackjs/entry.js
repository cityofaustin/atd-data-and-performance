import React, { Component } from "react";
import { render } from "react-dom";
import DocklessData from "./components/DocklessData";
class App extends Component {
  render() {
    return <DocklessData />;
  }
}
render(<App />, document.getElementById("root"));
