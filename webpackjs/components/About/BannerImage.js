import React from "react";
import styled from "styled-components";

const StyledBannerImage = styled.div`
  margin-top: -10px;
  margin-bottom: 2rem;
  height: ${props => `${props.height}px`};
  background-image: url(${props => props.photo});
  background-size: cover;
  background-position: center;
  @media (min-width: 1000px) {
    height: ${props => `${props.height * 1.5}px`};
  }
`;

const BannerImage = ({ photo, alt, height = "300" }) => (
  <StyledBannerImage photo={photo} height={height}>
    <img src={photo} alt={alt} className="sr-only" />
  </StyledBannerImage>
);

export default BannerImage;
