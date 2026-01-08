import React from "react";
import { Image, Nav as BsNav, Navbar, Container } from "react-bootstrap";
import Link from "next/link";

export default function Nav({ isHome }) {
  return (
    <Navbar expand="lg" className={`py-1 ${isHome ? "nav-shadow" : "border"}`}>
      <Container fluid key="nav-container">
        <Navbar.Brand as={Link} href="/" className="ps-2 me-auto">
          <div className="d-flex align-items-center">
            <div className="me-1">
              <Image
                height={40}
                src="/assets/COA-Logo-Horizontal-Official-RGB.svg"
                alt="City of Austin logo"
              />
            </div>
          </div>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
