import React from "react";
import Head from "next/head";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

// image size: 960 x 491px
const cards = [
  {
    title: "Traffic Cameras",
    description: "Live images from the City's traffic cameras",
    href: "/traffic-cameras",
    img: {
      src: "/assets/traffic-cameras.jpg",
      alt: "Traffic camera thumbnail",
    },
    key: "traffic_cameras",
  },
  {
    title: "Signal Evaluations",
    description: "Our signal evaluation pipeline",
    href: "/signal-evaluations",
    key: "signal_evaluations",
    img: { src: "/assets/bicycle-map.jpg", alt: "Bicycle map" },
  },
  {
    title: "Signal Monitor",
    description: "Real-time monitoring of the City's traffic signals",
    href: "/signal-monitor",
    img: { src: "/assets/signal-monitor.jpg", alt: "Signal monitor dashboard" },
    key: "signal_monitor",
  },
  {
    title: "Signal Assets",
    description:
      "Comprehensive map of traffic signal assets, including sensors, vehicle detectors, and school beacons.",
    href: "https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=c9bda776b1934e439285570b29d3259c",
    img: { src: "/assets/signal-assets.jpg", alt: "Signal asset map" },
  },
  {
    title: "Shared Mobility",
    description:
      "Info about signal requests where you can search and browse info.",
    href: "https://public.ridereport.com/austin",
    img: {
      src: "/assets/shared-mobility.png",
      alt: "Shared mobility dashboard",
    },
  },
  {
    title: "Vision Zero Viewer",
    description:
      "View crash data by month, year, mode, demographics, time of day, and location",
    href: "https://visionzero.austin.gov/viewer/",
    img: { src: "/assets/vision-zero-viewer.jpg", alt: "Vision Zero Viewer" },
  },
  {
    title: "Bicycle Map",
    description: "Our citywide map of bicycle routes",
    href: "https://www.arcgis.com/apps/webappviewer/index.html?id=c7fecf32a2d946fabdf062285d58d40c",
    img: { src: "/assets/bicycle-map.jpg", alt: "Bicycle map" },
  },
  {
    title: "Data Catalog",
    description:
      "Info about signal requests where you can search and browse info.",
    href: "/data-catalog",
    img: { src: "/assets/bicycle-map.jpg", alt: "Bicycle map" },
  },
];

export function CardItem({ href, title, description, icon, img }) {
  return (
    <Col xs={12} md={4} lg={3} className="p-2 p-md-3 p-xl-4">
      <Link className="text-decoration-none" href={href} passHref>
        <Card className="h-100 nav-tile">
          {img && <Card.Img variant="top" alt={img.alt} src={img.src} />}
          <Card.Body className="p-3 lh-1">
            <Card.Title className="fw-bold fs-6 text-primary">
              {icon} {title}
            </Card.Title>
            <span className="text-muted ">
              <small>{description}</small>
            </span>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Austin Transportation Data and Performance Hub</title>
        <meta
          property="og:title"
          content="Austin Transportation Data and Performance Hub"
        />
      </Head>
      <Nav isHome/>
      <Container>
        <Row>
          <Col xs={12} className="pt-5 text-center">
            <h1 className="text-primary fw-bold">Data & Performance Hub</h1>
          </Col>
        </Row>
        <Row className="mb-2 border-bottom">
          <Col xs={12} className="text-center">
            <p className="text-muted">
              Dashboards and public datasets curated by the Austin
              Transportation Department
            </p>
          </Col>
        </Row>
        <Row className="text-dts-4 mb-4">
          {cards.map((card) => {
            return <CardItem key={card.href} {...card} />;
          })}
        </Row>
      </Container>
      <Footer />
    </>
  );
}
