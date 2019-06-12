import React from "react";

const axios = require("axios");
const Markdown = require("react-markdown");

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsData: []
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://api.github.com/repos/cityofaustin/atd-data-tech/issues?labels=index"
      )
      .then(res => {
        this.setState({
          projectsData: res.data
        });
      });
  }

  render() {
    console.log("in render", this.state.projectsData);
    return (
      <div className="mb-5">
        <div className="row px-3 px-sm-0 mb-2">
          <h1>Our Projects</h1>
        </div>
        <div>
          {this.state.projectsData.map((project, i) => (
            <div>
              <h1>
                <Markdown source={project.title} />
              </h1>
              <Markdown source={project.body} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Projects;
