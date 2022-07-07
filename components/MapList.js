import { useState, useRef } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import ListSearch from "./ListSearch";
import { useFilteredGeojson } from "./../utils/helpers";

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

  return (
    <div className="wrapper">
      <Nav currentPageRoute="cameras" />
      <div className="main">
        <div className="main-row">
          <div className="sidebar">
            <div className="p-3">
              {/* <h2 className="border-5 border-start border-secondary">Traffic Cameras</h2> */}
              <span className="fs-2 fw-bold text-secondary"> | </span>
              <span className="fs-2 fw-bold text-primary">Traffic Cameras</span>
            </div>
            {/* conditionally *hide* the list components on feature select
              - this does not unmount and so persists scroll state */}
            <div className={(!!selectedFeature && "d-none") || ""}>
              <ListSearch
                filters={filters}
                setFilters={setFilters}
                setSelectedFeature={setSelectedFeature}
                hasSelectedFeature={!!selectedFeature}
              />
            </div>
            <div
              className={(!!selectedFeature && "d-none") || ""}
              style={{ overflowY: "scroll" }}
            >
              <div className="sidebar-content px-3">
                <List
                  geojson={filteredGeosjon}
                  mapRef={mapRef}
                  setSelectedFeature={setSelectedFeature}
                  ListItem={ListItem}
                />
              </div>
            </div>
            {/* render the sidebar with the details content if a feature is selected */}
            {selectedFeature && (
              <div className="sidebar-content pe-2">
                <div className="position-relative" style={{ zIndex: 200 }}>
                  <CloseButton
                    className="position-absolute top-0 end-0"
                    onClick={() => setSelectedFeature(null)}
                  />
                </div>
                <DetailsContent feature={selectedFeature} />
              </div>
            )}
          </div>
          <div className="map-container">
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
