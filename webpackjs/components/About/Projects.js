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
        console.log(res.data);
        this.setState({
          projectsData: res.data
        });
      });
  }

  render() {
    return (
      <div className="mb-5">
        <div className="row px-3 px-sm-0 mb-2">
          <h1>Our Projects</h1>
        </div>
        <div>
          {this.state.projectsData.map(project => (
            <div key={"div" + project.id}>
              <h2 key={"h1" + project.id}>
                <Markdown 
                  key={"title" + project.id}
                  source={project.title.split("Project: ")[1]}
                />
              </h2>
              <Markdown
                key={"desc" + project.id}
                source={(project.body.split("<!--")[0]).split("Description")[1]}
              />
              <a key={"link" + project.id} href={project.repository_url} target="_blank">View the code for {project.title.split("Project: ")[1]}.</a>
              <br />
              <br />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Projects;
