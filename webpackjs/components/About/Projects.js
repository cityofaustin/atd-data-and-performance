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
        let formattedData = data.map((item) => {
          // Rename the project title to drop prefixes like "Project" or "Product"
          if (item.title.includes(": ")) {
            item.title = item.title.split(": ")[1];
          }
          return item;
        });
        formattedData = formattedData.sort(function (a, b) {
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
          projectsData: formattedData,
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
                <Markdown key={"title" + project.id} source={project.title} />
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
                View {project.title} on GitHub.
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
