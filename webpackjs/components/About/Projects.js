import React from "react";
import { projects } from "./projectList";

class Projects extends React.Component {

componentDidMount() {
    console.log("Projects loaded");
}

render() {
    return (
      <div className="mb-5">
        <div className="row px-3 px-sm-0 mb-2">
        <h1>Our Projects</h1>
        </div>
        <ul>
            <div>
              {projects.map((project, i) => (
                <li key={`Project_${i}`}>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </li>
              ))}
            </div>
        </ul>
      </div>
    );
}
}
export default Projects;
