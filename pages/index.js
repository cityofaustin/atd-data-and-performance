import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NavTile from "../components/NavTile";

// image size: 960 x 491px
const cards = [
  {
    title: "Vision Zero Viewer",
    description:
      "View crash data by month, year, mode, demographics, time of day, and location",
    href: "https://visionzero.austin.gov/viewer/",
    img: { src: "/assets/vision-zero-viewer.jpg", alt: "Vision Zero Viewer" },
    external: true,
  },
  {
    title: "Bicycle Map",
    description: "Our citywide map of bicycle routes",
    href: "https://www.arcgis.com/apps/webappviewer/index.html?id=c7fecf32a2d946fabdf062285d58d40c",
    img: { src: "/assets/bicycle-map.jpg", alt: "Bicycle map" },
    external: true,
  },
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
    title: "Shared Mobility",
    description:
      "Explore ridership and travel patterns of shared mobility vehicles",
    href: "https://public.ridereport.com/austin",
    img: {
      src: "/assets/shared-mobility.png",
      alt: "Shared mobility dashboard",
      external: true,
    },
  },
  {
    title: "Signal Evaluations",
    description: "Our signal evaluation pipeline",
    href: "/signal-evaluations",
    key: "signal_evaluations",
    img: { src: "/assets/phb.jpg", alt: "Traffic signal image" },
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
    description: "Comprehensive map of our traffic and pedestrian signals",
    href: "https://austin.maps.arcgis.com/apps/webappviewer/index.html?id=c9bda776b1934e439285570b29d3259c",
    img: { src: "/assets/signal-assets.jpg", alt: "Signal asset map" },
    external: true,
  },
  {
    title: "Strategic Performance",
    description: "Key performance indicators toward our strategic goals",
    href: "https://data.austintexas.gov/stories/s/Mobility-Dashboard/gzb5-ykym/",
    img: { src: "/assets/strategic-direction.png", alt: "Strategic direction" },
    external: true,
  },

  {
    title: "Open Data",
    description: "Browse and download the data that powers our operations",
    href: "https://data.austintexas.gov/browse?City-of-Austin_Department-=Austin+Transportation&limitTo=datasets",
    img: { src: "/assets/open-data-logo.png", alt: "Open data logo" },
    external: true,
  },
];

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

      <div className="wrapper">
        <Nav isHome />
        <Container className="main">
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
            {cards.map((card) => (
              <Col
                key={card.href}
                xs={12}
                md={4}
                lg={3}
                className="p-2 p-md-3 p-xl-4"
              >
                <NavTile {...card} />
              </Col>
            ))}
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}
