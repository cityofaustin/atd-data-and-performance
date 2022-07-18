import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function InfoContent() {
  return (
    <Row>
      <Col>
        <p>
          This map depicts the location and status of the Austin Transportation
          Department's traffic cameras, which are used by the{" "}
          <a
            href="https://www.austintexas.gov/department/arterial-management"
            target="_blank"
            rel="noreferrer"
          >
            Mobility Management Center
          </a>{" "}
          to monitor and address traffic issues in real time. The camera feeds
          are not recorded, and they are not used for law enforcement activites.
        </p>
        <p>
          The data that powers this map is available for download from the City
          of Austin's{" "}
          <a
            href="https://data.austintexas.gov/Transportation-and-Mobility/Traffic-Cameras/b4k4-adkb"
            target="_blank"
            rel="noreferrer"
          >
            Open Data Portal
          </a>
          .
        </p>
      </Col>
    </Row>
  );
}
