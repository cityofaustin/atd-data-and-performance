import { useEffect, useState } from "react";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import JobsTable from "../components/pages/publisher/JobsTable";
import JobModal from "../components/pages/publisher/JobModal";
import { POSTGREST_ENDPOINT } from "../page-settings/publisher";

export default function PublisherLog() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loading = !error && !data;
  const [selectedJobName, setSelectedJobName] = useState(null);

  useEffect(() => {
    const url = `${POSTGREST_ENDPOINT}/jobs_latest`;
    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("something went wrong :/");
          return;
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        setError(error);
      });
  }, []);

  error && console.error(error);

  return (
    <>
      <Head>
        <title>Legacy scripts job publication log</title>
        <meta
          property="og:title"
          content="Austin Transportation Data and Performance Hub"
        />
      </Head>
      <Nav />
      <Container fluid>
        <Row>
          <Col>
            <h1>Legacy scripts publication log</h1>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12}>
            See job schedules configuration{" "}
            <a
              href="https://github.com/cityofaustin/atd-data-deploy/blob/production/config/scripts.yml"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </Col>
        </Row>
        <Row>
          <Col>
            <JobsTable
              data={data}
              loading={loading}
              error={error}
              setSelectedJobName={setSelectedJobName}
              fieldFilter="main"
            />
          </Col>
        </Row>
      </Container>
      {selectedJobName && (
        <JobModal
          selectedJobName={selectedJobName}
          setSelectedJobName={setSelectedJobName}
        />
      )}
      <Footer />
    </>
  );
}
