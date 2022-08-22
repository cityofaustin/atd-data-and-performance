import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FaMapMarkerAlt, FaList, FaInfoCircle } from "react-icons/fa";
import IconLabel from "./IconLabel";

export default function MapListMobileNav({ title, activeTab, dispatchLayout }) {
  return (
    <Container
      fluid
      className={`${activeTab === "map" ? "nav-shadow" : "border"}`}
    >
      <Row>
        <ul className="nav nav-pills nav-fill px-0">
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "map" && "active") || ""}`}
              aria-current={activeTab === "map" ? "page" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ name: "list", show: false });
              }}
            >
              <div className="d-flex justify-content-center">
                <IconLabel label="Map" Icon={FaMapMarkerAlt} />
              </div>
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
                dispatchLayout({ name: "list", show: true });
              }}
            >
              <div className="d-flex justify-content-center">
                <IconLabel label="List" Icon={FaList} />
              </div>
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "info" && "active") || ""}`}
              aria-current={activeTab === "info" ? "page" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({
                  name: "info",
                  show: true,
                  isSmallScreen: true,
                });
              }}
            >
              <div className="d-flex justify-content-center">
                <IconLabel label="Info" Icon={FaInfoCircle} />
              </div>
            </a>
          </li>
        </ul>
      </Row>
    </Container>
  );
}
