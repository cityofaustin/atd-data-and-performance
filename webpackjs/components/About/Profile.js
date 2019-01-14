import React, { Component } from "react";
import ProfilePicture from "./ProfilePicture";
import styled from "styled-components";

const StyledLabels = styled.div`
  text-align: center;
  margin: 0.5rem 0 1.5rem;
`;

const Profile = ({ name, title, image }) => (
  <div className="col-xs-12 col-sm-4 mt-3">
    <ProfilePicture name={name} image={image} />
    <StyledLabels>
      <h4>{name}</h4>
      <h5>{title}</h5>
    </StyledLabels>
  </div>
);

export default Profile;
