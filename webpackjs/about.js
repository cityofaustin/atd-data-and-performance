import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";

import BannerImage from "./components/About/BannerImage";
import Body from "./components/About/Body";
import Team from "./components/About/Team";

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
          <BannerImage
            photo={`/components/images/keyboard.jpg`}
            alt="white keyboard"
          />
          <div className="container">
            <Body />
            <Team />
          </div>
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
