import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NavTile from "../components/NavTile";
import PageHead from "../components/PageHead";
import PAGES from "../page-settings/home";

export default function Home() {
  return (
    <>
      <Head>
        <PageHead
          title="Austin Transportation Data and Performance Hub"
          description="Dashboards and public datasets curated by the City of Austin Transportation Department"
          pageRoute="/"
          imageRoute=""
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
            {PAGES.map((page) => (
              <Col
                key={page.href}
                xs={12}
                md={4}
                lg={3}
                className="p-2 p-md-3 p-xl-4"
              >
                <NavTile {...page} />
              </Col>
            ))}
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}
