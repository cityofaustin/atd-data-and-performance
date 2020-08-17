import React from "react";

const axios = require("axios");
const Markdown = require("react-markdown");

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectsData: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://api.github.com/repos/cityofaustin/atd-data-tech/issues?labels=index,status: active"
      )
      .then((res) => {
        const data = res.data;
        data.sort(function (a, b) {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();

          if (titleA < titleB) {
            return -1;
          }

          if (titleA > titleB) {
            return 1;
          }

          return 0;
        });
        this.setState({
          projectsData: data,
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
          {this.state.projectsData.map((project) => (
            <div key={"div" + project.id}>
              <h2 key={"h1" + project.id}>
                <Markdown
                  key={"title" + project.id}
                  source={project.title.split("Project: ")[1]}
                />
              </h2>
              <Markdown
                key={"desc" + project.id}
                source={project.body.split("<!--")[0].split("Description")[1]}
              />
              <a
                key={"link" + project.id}
                href={project.html_url}
                target="_blank"
              >
                View {project.title.split("Project: ")[1]} on GitHub.
              </a>
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
