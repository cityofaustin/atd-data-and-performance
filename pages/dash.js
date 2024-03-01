import { useEffect, useState } from "react";
import Head from "next/head"; // check this
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import VizTile from "../components/pages/data-visualizations/VizTile";
import { KNACK_HEADERS, KNACK_URL } from "../page-settings/dash";
import PageHead from "../components/PageHead"; // this is from the index

const DESCRIPTION =
  "Dashboards and datasets curated by City of Austin Transportation and Public Works"; // update

export default function DataVisualizations() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loading = !error && !data;

  useEffect(() => {
    fetch(KNACK_URL, { headers: KNACK_HEADERS })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.records)
          const activeRecords = result.records.filter(record=>record.field_724_raw)
          setData(activeRecords);
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
      <PageHead
        title="Austin Transportation Public Works Dash"
        description={DESCRIPTION}
        pageRoute="/"
        imageRoute="/assets/home-thumbnail.png"
      />
      <div className="wrapper">
        <Nav />
        <Container className="main">
          <Row>
            <Col xs={12} className="pt-5 text-center">
              <h1 className="text-primary fw-bold">Dash</h1>
            </Col>
          </Row>
          <Row className="mb-2 border-bottom">
            <Col xs={12} className="text-center">
              <p className="text-muted">{DESCRIPTION}</p>
            </Col>
          </Row>
          <Row className="text-dts-4 mb-4">
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
                  imgSrc={viz.field_719_raw.url}
                  description={viz.field_720}
                  imgAltText={"we need alt text"}
                  publiclyAccessible={viz.field_722_raw}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}
