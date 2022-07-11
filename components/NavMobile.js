import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FaMapMarkerAlt, FaList, FaInfoCircle } from "react-icons/fa";
import IconLabel from "./IconLabel";

export default function NavMobile({ title, activeTab, dispatchLayout }) {
  return (
    <Container
      fluid
      className={`${activeTab === "map" ? "nav-shadow" : "border"}`}
    >
      {/* <Row>
        <Col>
          <PageTitle title={title} />
        </Col>
      </Row> */}
      <Row>
        <ul className="nav nav-pills nav-fill">
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "map" && "active") || ""}`}
              aria-current={activeTab === "map" ? "page" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ name: "showList", value: false });
              }}
            >
              <IconLabel label="Map" Icon={FaMapMarkerAlt} />
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                (activeTab === "sidebar" && "active") || ""
              }`}
              aria-current={activeTab === "sidebar" ? "page" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ name: "showList", value: true });
              }}
            >
              <IconLabel label="List" Icon={FaList} />
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "info" && "active") || ""}`}
              aria-current={activeTab === "info" ? "page" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ name: "showInfo", value: true });
              }}
            >
              <IconLabel label="Info" Icon={FaInfoCircle} />
            </a>
          </li>
        </ul>
      </Row>
    </Container>
  );
}
