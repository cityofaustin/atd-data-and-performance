import React from "react";
import { Image, Nav as BsNav, Navbar, Container } from "react-bootstrap";
import Link from "next/link";

const PAGES = [
  // { label: "About", route: "/about" },
];

export default function Nav({ currentPageRoute, isHome }) {
  return (
    <>
      <Navbar
        expand="lg"
        className={`py-1 ${isHome ? "nav-shadow" : "border"}`}
      >
        <Container fluid key="nav-container">
          <div className="d-flex flex-nowrap">
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
          </div>
          <Navbar.Toggle
            aria-controls="site-navbar"
            className="navbar-toggle"
          />
          <Navbar.Collapse id="site-navbar" className="justify-content-end">
            <BsNav>
              {PAGES.map((page, idx) => {
                const fontWeightClass =
                  currentPageRoute === page.route ? "font-weight-bold" : "";
                const borderClass = idx === 0 ? "" : "navbar-menu-borders";
                return (
                  <div
                    key={page.route}
                    className={`flex-grow-1 mx-3 my-auto ${borderClass}`}
                  >
                    <BsNav.Link
                      className={`py-0 text-primary ${fontWeightClass}`}
                      href={page.route}
                    >
                      {page.label}
                    </BsNav.Link>
                  </div>
                );
              })}
            </BsNav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
