import React from "react";
import { Image, Nav as BsNav, Navbar, Container } from "react-bootstrap";
import Link from "next/link";

export default function Nav({ isHome }) {
  return (
    <>
      <Navbar
        expand="lg"
        className={`py-1 ${isHome ? "nav-shadow" : "border"}`}
      >
        <Container fluid key="nav-container">
          <Link href="/" passHref>
            <Navbar.Brand
              style={{ cursor: "pointer" }}
              className="ps-2 me-auto"
            >
              <div className="d-flex align-items-center">
                <div className="me-1">
                  <Image
                    height={50}
                    src="/assets/2023_austin_transportation_public_works_branding_guide_royal.png"
                    alt="Transportation and Public Works wordmark including the City of Austin seal"
                  />
                </div>
              </div>
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
    </>
  );
}
