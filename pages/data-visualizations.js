import { useEffect, useState } from "react";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import VizTile from "../components/pages/data-visualizations/VizTile";
import { KNACK_HEADERS, KNACK_URL } from "../page-settings/data-visualizations";

/**
 *
 */
export default function DataVisualizations() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loading = !error && !data;

  useEffect(() => {
    fetch(KNACK_URL, { headers: KNACK_HEADERS })
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result.records);
        },
        (error) => {
          setError(error.toString());
        }
      );
  }, []);

  error && console.error(error);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Transportation Public Works Data Visualizations</title>
        <meta
          property="og:title"
          content="Austin Transportation Data and Performance Hub"
        />
      </Head>
      <Nav />
      <Container className="main" fluid>
        <Row>
          <Col>
            <h1>TPW Department data visualizations</h1>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12}>Question -- Do we include a link to the knack page?</Col>
        </Row>
        <Row className="text-dts-4 m-4">
          {data.map((viz) => (
            <Col
              key={viz.id}
              xs={12}
              md={4}
              lg={3}
              className="p-2 p-md-3 p-xl-4"
            >
              <VizTile
                href={viz.field_721_raw.url}
                title={viz.field_718}
                imgSrc={viz.field_719_raw.thumb_url}
                description={viz.field_720}
                imgAltText={"we need alt text"}
                publiclyAccessible={viz.field_722 === "Yes"}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
}
