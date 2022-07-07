import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

export default function Footer() {
  return (
    <Container fluid className="footer mt-5 p-5">
      <Row className="align-items-center">
        <Col xs={12} md={6} lg={8}>
          <div className="d-flex flex-nowrap">
            <div className="d-flex align-items-center">
              <Image
                height={80}
                src="/assets/coa_seal_full_white.svg"
                alt="Generic placeholder"
              />
              <div
                className="d-flex flex-column align-items-start text-white ms-3"
                style={{ lineHeight: 1 }}
              >
                <span className="fs-5 fw-bold py-1">
                  Data & Technology Services
                </span>
                <span className="fs-6 fw-light py-1">
                  Austin Transportation
                </span>
              </div>
            </div>
          </div>
        </Col>

        <Col className="text-white fw-light">
          <Row className="align-self-center">
            <Col xs={6} md={4} className="py-1">
              About
            </Col>
            <Col xs={6} md={4} className="py-1">
              Data
            </Col>
            <Col xs={6} md={4} className="py-1">
              Disclaimer
            </Col>
            <Col xs={6} md={4} className="py-1">
              Contact
            </Col>
            <Col xs={6} md={4} className="py-1">
              Code
            </Col>
            <Col xs={6} md={4} className="py-1">
              Privacy
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
