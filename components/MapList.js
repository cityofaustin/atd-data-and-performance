import { useState, useRef, useReducer, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Modal from "react-bootstrap/Modal";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import NavMobile from "./NavMobile";
import ListSearch from "./ListSearch";
import {
  useHiddenOverflow,
  useCheckboxFilters,
  useSearchValue,
  useIsTouchDevice,
} from "./../utils/helpers";
import { FaInfoCircle } from "react-icons/fa";

/**
 * Layout logic
 * - if a feature is selected (on the map or from the list):
 *    - if on mobile: hide map, show sidebar
 *    - hide list, hide inf show details
 * - mobile only: if the map nav tab is seleted:
 *    - hide sidebar
 * * - mobile only: if the list tab is seleted:
 *    - hide map; hide info
 * whenever a feature is selected (selectedFeature is not null), the feature details
 * will render on the sidebar.
 */
const initialLayout = (isSmallScreen) => ({
  map: true,
  listSearch: true,
  sidebar: !isSmallScreen,
  title: !isSmallScreen,
  info: false,
});

const layoutReducer = (state, { name, value, isSmallScreen }) => {
  if (name === "viewPortChange" && isSmallScreen) {
    // adjust for mobile - defaults to map view
    return { ...state, map: true, sidebar: false, title: false };
  } else if (name === "viewPortChange" && !isSmallScreen) {
    // adjust for not-mobile
    return { ...state, map: true, sidebar: true, title: true };
  }
  if (name === "showList" && value) {
    return {
      ...state,
      sidebar: true,
      listSearch: true,
      map: false,
      info: false,
    };
  } else if (name === "showList" && !value) {
    return { ...state, sidebar: false, map: true, info: false };
  }
  if (name === "showInfo" && value && !isSmallScreen) {
    // on normal screen size open the info modal
    return {
      ...state,
      info: true,
    };
  } else if (name === "showInfo" && !value && !isSmallScreen) {
    return { ...state, info: false };
  }
  if (name === "showInfo" && value && isSmallScreen) {
    // on mobile, info content renders in sidebar (with listsearch hidden)
    return {
      ...state,
      map: false,
      info: true,
      listSearch: false,
      sidebar: true,
    };
  }
  return state;
};

const PageTitle = ({ title, onClick }) => {
  return (
    <div className="px-3 d-flex justify-content-start">
      <span className="fs-2 fw-bold text-primary border-start border-4 my-2 ps-2">
        {title}
      </span>
      {onClick && (
        <span
          className="text-secondary align-self-center m-2 fs-5"
          style={{ cursor: "pointer" }}
          onClick={onClick}
        >
          <FaInfoCircle />
        </span>
      )}
    </div>
  );
};

const FeatureModal = ({ selectedFeature, setSelectedFeature, children }) => (
  <Modal
    show={!!selectedFeature}
    onHide={() => setSelectedFeature(null)}
    animation={false}
    centered
  >
    <Modal.Header closeButton />
    {children}
  </Modal>
);

export default function MapList({
  filterSettings,
  searchSettings,
  PopUpContent,
  PopUpHoverContent,
  ListItemContent,
  InfoContent,
  geojson,
  loading,
  error,
  layerStyles,
  title,
}) {
  const [filters, setFilters] = useState(filterSettings);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const mapRef = useRef();

  const filteredGeosjon = useCheckboxFilters({
    geojson,
    filters,
  });

  const searchedGeojson = useSearchValue({
    geojson: filteredGeosjon,
    searchValue,
    ...searchSettings,
  });

  // bootstrap `md` and lower   todo: // move to settings
  const isSmallScreen = useMediaQuery({ maxWidth: 991 });

  const isTouchDevice = useIsTouchDevice();

  const [layout, dispatchLayout] = useReducer(
    layoutReducer,
    initialLayout(isSmallScreen)
  );

  useEffect(() => {
    dispatchLayout({
      name: "selectedFeature",
      value: !!selectedFeature,
      isSmallScreen,
    });
    if (!mapRef.current || !selectedFeature) return;
    const zoom = mapRef.current.getZoom();
    const { coordinates } = selectedFeature.geometry;
    mapRef.current.fitBounds([coordinates, coordinates], {
      padding: 100,
      duration: 1000,
      maxZoom: zoom > 14 ? zoom : 14,
      linear: true,
    });
  }, [isSmallScreen, selectedFeature]);

  useEffect(() => {
    dispatchLayout({ name: "viewPortChange", value: true, isSmallScreen });
  }, [isSmallScreen]);

  useEffect(() => {
    // ensures the map canavs is always fully painted when activated
    // deals with the weird effects of changing/hiding the map container
    mapRef.current?.resize();
  }, [layout.map]);

  useHiddenOverflow();

  return (
    <div className="wrapper-contained">
      <h1>{(isTouchDevice && "YES") || "NO"}</h1>
      <Nav />
      {isSmallScreen && (
        <NavMobile
          title="Traffic cameras"
          activeTab={layout.map ? "map" : layout.info ? "info" : "sidebar"}
          dispatchLayout={dispatchLayout}
        />
      )}
      <div className="main">
        <div className="main-row">
          {/* sidepar panel */}
          {layout.sidebar && (
            <div
              className="sidebar"
              style={isSmallScreen ? null : { maxWidth: "450px" }}
            >
              {/* page title */}
              {layout.title && (
                <PageTitle
                  title={title}
                  onClick={() =>
                    dispatchLayout({ name: "showInfo", value: true })
                  }
                />
              )}

              <div
                className={`d-flex flex-column ${
                  (!layout.listSearch && "d-none") || ""
                }`}
                style={{ overflowY: "hidden" }}
              >
                <ListSearch
                  filters={filters}
                  setFilters={setFilters}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  searchSettings={searchSettings}
                  setSelectedFeature={setSelectedFeature}
                  hasSelectedFeature={!!selectedFeature}
                />
                <div className="px-3" style={{ overflowY: "scroll" }}>
                  <List
                    geojson={searchedGeojson}
                    mapRef={mapRef}
                    setSelectedFeature={setSelectedFeature}
                    ListItemContent={ListItemContent}
                  />
                </div>
              </div>

              {/* extra page info */}
              {layout.info && isSmallScreen && (
                <>
                  <PageTitle title={title} />
                  <InfoContent />
                </>
              )}
              {layout.info && !isSmallScreen && (
                <Modal
                  show={true}
                  animation={false}
                  onHide={() =>
                    dispatchLayout({ name: "showInfo", value: false })
                  }
                  centered
                >
                  <Modal.Header closeButton>
                    <PageTitle title={title} />
                  </Modal.Header>
                  <Modal.Body>
                    <InfoContent />
                  </Modal.Body>
                </Modal>
              )}
            </div>
          )}

          {/* map container */}
          <div className={`map-container ${layout.map ? "" : "d-none"}`}>
            {loading && <p>Loading...</p>}
            {!loading && !error && (
              <Map
                geojson={filteredGeosjon}
                mapRef={mapRef}
                selectedFeature={selectedFeature}
                setSelectedFeature={setSelectedFeature}
                PopUpContent={PopUpContent}
                PopUpHoverContent={PopUpHoverContent}
                layerStyles={layerStyles}
                isSmallScreen={isSmallScreen}
              />
            )}
          </div>

          {isSmallScreen && (
            <FeatureModal
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
            >
              <PopUpContent feature={selectedFeature} />
            </FeatureModal>
          )}
        </div>
      </div>
    </div>
  );
}
