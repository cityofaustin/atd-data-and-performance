import React, { Component } from "react";
import { render } from "react-dom";

import BannerImage from "./components/About/BannerImage";
import Body from "./components/About/Body";
import Team from "./components/About/Team";
import Articles from "./components/About/Articles";
import Nav from "./components/Shared/Nav";
import Projects from "./components/About/Projects";

class About extends Component {

  render() {
    return (
      <div>
        <Nav />
        <div>
          <BannerImage
            photo={`/components/images/hero_tmc.jpg`}
            alt="Austin Transportation Traffic Management Center (TMC)"
            height="350"
          />
          <div className="container">
            <Body />
          </div>
          <div className="container">
            <Team />
          </div>
          <BannerImage
            photo={`/components/images/keyboard.jpg`}
            alt="white keyboard"
          />
          <div className="container">
            <Projects />
          </div>
          <div className="container">
            <Articles />
          </div>
        </div>
      </div>
    );
  }
}

render(<About />, document.getElementById("root-About"));
