import React from "react";
import { Image, Nav as BsNav, Navbar, Container } from "react-bootstrap";
import Link from "next/link";

const PAGES = [
  // { label: "About", route: "/about" },
];

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
                    src="/assets/coa_seal_full_navy.svg"
                    alt="City of Austin seal"
                  />
                </div>
                <Image
                  height={20}
                  src="/assets/transportation_din_navy.svg"
                  alt="Austin transportation logo"
                />
              </div>
            </Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
    </>
  );
}
