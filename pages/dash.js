import { useMemo } from "react";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import VizTile from "../components/pages/dash/VizTile";
import {
  KNACK_HEADERS,
  KNACK_URL,
  KNACK_FIELDS_MAP,
} from "../page-settings/dash";
import { useKnack } from "../utils/knack";

const DESCRIPTION = "Dashboards, reports, maps & datasets by & for TPW";

export default function DataVisualizations() {
  const { data, loading, error } = useKnack(KNACK_URL, KNACK_HEADERS);

  const visibleRecords = useMemo(
    () =>
      data?.records.filter(
        (record) => record[KNACK_FIELDS_MAP["publishRecord"]]
      ),
    [data]
  );

  error && console.error(error);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Dash</title>
        <meta property="og:title" content="Austin TPW Dash" />
      </Head>
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
            {visibleRecords.map((viz) => (
              <Col
                key={viz.id}
                xs={12}
                md={4}
                lg={3}
                className="p-2 p-md-3 p-xl-4"
              >
                <VizTile
                  href={viz[KNACK_FIELDS_MAP["url"]].url}
                  title={viz[KNACK_FIELDS_MAP["title"]]}
                  imgSrc={viz[KNACK_FIELDS_MAP["imgSrc"]].url}
                  description={viz[KNACK_FIELDS_MAP["description"]]}
                  imgAltText={viz[KNACK_FIELDS_MAP["altText"]]}
                  publiclyAccessible={
                    viz[KNACK_FIELDS_MAP["publiclyAccessible"]]
                  }
                />
              </Col>
            ))}
          </Row>
        </Container>
        <Container fluid className="footer mt-5 p-5" />
      </div>
    </>
  );
}
