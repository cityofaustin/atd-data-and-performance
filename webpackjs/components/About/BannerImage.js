import React from "react";
import styled from "styled-components";

const StyledBannerImage = styled.div`
  margin-top: -10px;
  margin-bottom: 2rem;
  height: 200px;
  background-image: url(${props => props.photo});
  background-size: "cover";
`;

const BannerImage = ({ photo, alt }) => (
  <StyledBannerImage photo={photo}>
    <img src={photo} alt={alt} className="sr-only" />
  </StyledBannerImage>
);

export default BannerImage;
