import { useState, useRef, useReducer, useEffect } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import { useMediaQuery } from "react-responsive";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import ListSearch from "./ListSearch";
import { useFilteredGeojson } from "./../utils/helpers";

const initialLayout = (isSmallScreen) => ({
  map: true,
  list: true,
  search: true,
  details: false,
  sidebar: !isSmallScreen,
  title: !isSmallScreen,
});

const stateReducer = (state, action) => {
  if (action.selectedFeature === true) {
    return { ...state, details: true, list: false, search: false };
  } else if (action.selectedFeature === false) {
    return { ...state, details: false, list: true, search: true };
  }
  if (action.showList === true) {
    return { ...state, sidebar: true, map: false, list: true, search: true };
  }
  if (action.showList === false) {
    return { ...state, sidebar: false, map: true };
  }
  return state;
};

const MobileNav = ({ title, activeTab, dispatchLayout }) => {
  return (
    <Container fluid className="nav-shadow">
      <Row>
        <Col>
          <h1>{title}</h1>
        </Col>
      </Row>
      <Row>
        <ul className="nav nav-tabs nav-fill">
          <li className="nav-item">
            <a
              className={`nav-link ${(activeTab === "map" && "active") || ""}`}
              aria-current={activeTab === "map" ? "active" : ""}
              href="#"
              onClick={() => {
                dispatchLayout({ showList: false });
              }}
            >
              Map
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
              List
            </a>
          </li>
        </ul>
      </Row>
    </Container>
  );
};

export default function MapList({
  initialFilters,
  PopUpContent,
  DetailsContent,
  ListItem,
  geojson,
  loading,
  error,
  layerStyles,
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const mapRef = useRef();
  const filteredGeosjon = useFilteredGeojson({
    geojson,
    filters,
  });
  // bootstrap `md` and lower   todo: // move to settings
  const isSmallScreen = useMediaQuery({ maxWidth: 991 });
  const [layout, dispatchLayout] = useReducer(
    stateReducer,
    initialLayout(isSmallScreen)
  );

  useEffect(() => {
    dispatchLayout({ selectedFeature: !!selectedFeature });
  }, [selectedFeature]);

  return (
    <div className="wrapper-contained">
      {!isSmallScreen && <Nav />}
      {isSmallScreen && (
        <MobileNav
          title="Traffic cameras"
          activeTab={layout.map ? "map" : "sidebar"}
          dispatchLayout={dispatchLayout}
        />
      )}
      <div className="main">
        <div className="main-row">
          {/* sidepar panel */}
          {layout.sidebar && (
            <div className="sidebar">
              {/* page title */}
              {layout.title && (
                <div className="p-3">
                  <span className="fs-2 fw-bold text-secondary"> | </span>
                  <span className="fs-2 fw-bold text-primary">
                    Traffic Cameras
                  </span>
                </div>
              )}

              {/* search */}
              {layout.search && (
                <div>
                  <ListSearch
                    filters={filters}
                    setFilters={setFilters}
                    setSelectedFeature={setSelectedFeature}
                    hasSelectedFeature={!!selectedFeature}
                  />
                </div>
              )}

              {/* scrolling list */}
              {layout.list && (
                <div style={{ overflowY: "scroll" }}>
                  <div className="px-3">
                    <List
                      geojson={filteredGeosjon}
                      mapRef={mapRef}
                      setSelectedFeature={setSelectedFeature}
                      ListItem={ListItem}
                    />
                  </div>
                </div>
              )}

              {/* feature details in sidebar */}
              {selectedFeature && (
                <div className="pe-2">
                  <div className="position-relative" style={{ zIndex: 100 }}>
                    <CloseButton
                      className="position-absolute top-0 end-0"
                      onClick={() => setSelectedFeature(null)}
                    />
                  </div>
                  <DetailsContent feature={selectedFeature} />
                </div>
              )}
            </div>
          )}

          {/* map panel */}
          <div className={`map-container ${layout.map ? "" : "d-none"}`}>
            {loading && <p>Loading...</p>}
            {!loading && !error && (
              <Map
                geojson={filteredGeosjon}
                mapRef={mapRef}
                selectedFeature={selectedFeature}
                setSelectedFeature={setSelectedFeature}
                PopUpContent={PopUpContent}
                layerStyles={layerStyles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
