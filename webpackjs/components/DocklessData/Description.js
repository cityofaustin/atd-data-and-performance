import React from "react";

const Description = ({}) => (
  <div>
    <p>
      This page summarizes dockless mobility trips reported to the City of
      Austin Transportation Department as part of the{" "}
      <a href="https://austintexas.gov/docklessmobility">Dockless Mobility</a>{" "}
      operating rules.
    </p>
    <p>
      Data is drawn from our{" "}
      <a href="https://data.austintexas.gov/Transportation-and-Mobility/Dockless-Vehicle-Trips/7d8e-dm7r">
        dockless vehicle trips dataset
      </a>{" "}
      and is updated on a daily basis.
    </p>
    <p>
      A trip record is included in this summary report if it meets the following
      criteria:
    </p>
    <ul>
      <li>Trip distance at least 0.1 miles and less than 500 miles</li>
      <li>Trip duration less than 24 hours</li>
    </ul>
    <p>
      You may also be interested in our interactive map,{" "}
      <a href="http://dockless.austintexas.io/">Dockless Data Explorer</a>
    </p>
  </div>
);

export default Description;
