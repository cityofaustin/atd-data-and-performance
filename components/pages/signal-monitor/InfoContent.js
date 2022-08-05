import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function InfoContent() {
  return (
    <Row>
      <Col>
        <p>
          This dashboard reports the operation status of traffic signals in
          Austin, TX. Traffic signals enter flash mode when something is
          preventing the signal from operating normally. This is typically the
          result of a power surge, power outage, or damage to signal equipment.
          A signal may also be intentionally placed into flash mode for
          maintenance purposes or be scheduled to flash overnight.
        </p>
        <h5>Advanced Transportation Management</h5>
        <p>
          All of the City&apos;s signals communicate with our Advanced Transportation
          Management System. When these signals go on flash, they will be
          reported on this dashboard. It also occasionally happens that the
          event that disables a traffic signal also disables network
          communication to the signal, in which case the signal outage will not
          be reported here.
        </p>
        <h5>Report an Issue</h5>
        <p>
          To report an issue or request a new traffic signal, call 3-1-1. You
          can also{" "}
          <a
            href="https://austin-csrprodcwi.motorolasolutions.com/ServiceRequest.mvc/SRIntakeStep2/TRASIGNE?guid=59340171d27247fa93fe951cdaf37dcc"
            target="_blank"
            rel="noreferrer"
          >
            submit a traffic signal service request online.
          </a>
        </p>
        <p>
          The data that powers this map is available for download from the City
          of Austin&apos;s{" "}
          <a
            href="https://data.austintexas.gov/Transportation-and-Mobility/Traffic-Signals-Status/5zpr-dehc"
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
