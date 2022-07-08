import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FaMapMarkerAlt, FaSearch, FaInfoCircle } from "react-icons/fa";

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
              aria-current={activeTab === "map" ? "active" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ showList: false });
              }}
            >
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center">
                  <FaMapMarkerAlt />
                  <span className="ms-1">Map</span>
                </div>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                (activeTab === "sidebar" && "active") || ""
              }`}
              aria-current={activeTab === "sidebar" ? "active" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ showList: true });
              }}
            >
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center">
                  <FaSearch />
                  <span className="ms-1">Search</span>
                </div>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "info" && "active") || ""}`}
              aria-current={activeTab === "info" ? "active" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ showInfo: true });
              }}
            >
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center">
                  <FaInfoCircle />
                  <span className="ms-1">Info</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </Row>
    </Container>
  );
}
