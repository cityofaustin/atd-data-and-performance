import React from "react";
import Profile from "./Profile";

import { people } from "./people";

const Team = ({}) => (
  <div className="mb-5">
    <div className="row px-3 px-sm-0">
      <h1>Our Team</h1>
    </div>
    <div className="row">
      {people.map((person, i) => (
        <Profile
          key={`person_${i}`}
          name={person.name}
          title={person.title}
          image={person.image}
          pronouns={person.pronouns}
        />
      ))}
    </div>
  </div>
);

export default Team;
