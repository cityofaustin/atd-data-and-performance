import { useState, useRef, useReducer, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import NavMobile from "./NavMobile";
import ListSearch from "./ListSearch";
import {
  useHiddenOverflow,
  useCheckboxFilters,
  useSearchValue,
} from "./../utils/helpers";
import { FaInfoCircle } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

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
  details: false,
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
      details: false,
      map: false,
      info: false,
    };
  } else if (name === "showList" && !value) {
    return { ...state, sidebar: false, map: true, info: false };
  } else if (name === "showInfo" && value) {
    return {
      ...state,
      sidebar: true,
      map: false,
      info: true,
      listSearch: false,
      details: false,
    };
  }
  return state;
};

const PageTitle = ({ title }) => (
  <div className="px-3 d-flex justify-content-start align-items-center">
    {/* <span className="fs-2 fw-bold text-secondary"> | </span> */}
    <span className="fs-2 fw-bold text-primary">{title}</span>
    <span className="fs-5 mx-2 text-secondary">
      <FaInfoCircle />
    </span>
  </div>
);

const ModalThing = ({ selectedFeature, setSelectedFeature, children }) => (
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
  }, [selectedFeature]);

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
              {layout.title && <PageTitle title="Traffic cameras" />}

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
              {layout.info && <InfoContent />}
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
            <ModalThing
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
            >
              <PopUpContent feature={selectedFeature} />
            </ModalThing>
          )}
        </div>
      </div>
    </div>
  );
}
