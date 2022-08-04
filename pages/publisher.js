import { useEffect, useState } from "react";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";

const dateHandler = (date) => new Date(date).toLocaleString();

const getStatusClass = (status) => {
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "danger";
    default:
      "primary";
  }
};

const statusHandler = (status) => {
  const className = getStatusClass(status);
  return <Badge bg={className}>{status}</Badge>;
};

const endpoint = "https://atd-postgrest.austinmobility.io/legacy-scripts/jobs_latest";

const fields = [
  { label: "name", key: "name" },
  { label: "start_date", key: "start_date", handler: dateHandler },
  { label: "end_date", key: "end_date", handler: dateHandler },
  { label: "status", key: "status", handler: statusHandler },
  { label: "message", key: "message" },
  { label: "records_processed", key: "records_processed" },
  { label: "source", key: "source" },
  { label: "destination", key: "destination" },
];

export default function PublisherLog() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("something went wrong :/");
          return;
        }
        return res.json();
      })
      .then((data) => setJobs(data))
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
      <Container>
        <Row>
          <Col>
            <h1>Legacy scripts publication log</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table size="sm" striped hover>
              <thead>
                <tr>
                  {fields.map((field) => (
                    <th key={field.key}>{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!error && !jobs && (
                  <tr>
                    <td colSpan={fields.length} className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={fields.length} className="text-center">
                      Something went wrong :/
                    </td>
                  </tr>
                )}
                {!error &&
                  jobs &&
                  jobs?.map((job) => (
                    <tr key={job.id}>
                      {fields.map((field) => (
                        <td key={field.key}>
                          {field.handler
                            ? field.handler(job[field.key])
                            : job[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
