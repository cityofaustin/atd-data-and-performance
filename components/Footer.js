import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaRegEnvelope } from "react-icons/fa";
import IconLabel from "./IconLabel";

export const LINKS = [
  { label: "About", href: "https://austinmobility.io" },
  { label: "Data", href: "https://data.austintexas.gov" },
  {
    label: "Disclaimer",
    href: "https://www.austintexas.gov/page/city-austin-open-data-terms-use",
  },
  {
    label: "Code",
    href: "https://github.com/cityofaustin/atd-data-and-performance",
  },
  { label: "Privacy", href: "https://www.austintexas.gov/page/privacy-policy" },
  {
    label: "Contact",
    href: "mailto:transportation.data@austintexas.gov",
    icon: FaRegEnvelope,
  },
];

const FooterLink = ({ label, href, icon }) => (
  <Col xs={6} md={4} className="py-1">
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-reset text-decoration-none footer-link"
    >
      {icon ? <IconLabel Icon={icon} label={label} /> : label}
    </a>
  </Col>
);

export default function Footer({ links }) {
  return (
    <Container fluid className="footer mt-5 p-5">
      <Row className="align-items-center">
        <Col xs={12} md={6} lg={8}>
          <div className="d-flex flex-nowrap">
            <a href="https://austinmobility.io" className="d-flex align-items-center">
              <div
                className="d-flex flex-column align-items-start text-white ms-3"
                style={{ lineHeight: 1 }}
              >
                <span className="fs-5 fw-bold py-1">
                  Data &amp; Technology Services
                </span>
                <span className="fs-6 fw-light py-1">
                  Austin Transportation &amp; Public Works
                </span>
              </div>
            </a>
          </div>
        </Col>

        <Col className="text-white fw-light">
          <Row className="align-self-center">
            {LINKS.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
