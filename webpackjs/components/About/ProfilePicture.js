import React from "react";
import styled from "styled-components";

const StyledProfilePicture = styled.div`
  img {
    width: 150px;
    border-radius: 50%;
    display: block;
    margin: auto;
  }
`;

const ProfilePicture = ({ name, image }) => (
  <StyledProfilePicture>
    <img src={imagePathWithFallback(image)} alt={name} />
  </StyledProfilePicture>
);

function imagePathWithFallback(image) {
  let prefixPath = `/components/images/headshots`;
  if (!image) {
    return `${prefixPath}/generic.png`;
  } else {
    return `${prefixPath}/${image}.jpeg`;
  }
}

export default ProfilePicture;
