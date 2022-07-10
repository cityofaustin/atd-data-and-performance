import { useState, useRef, useReducer, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import NavMobile from "./NavMobile";
import ListSearch from "./ListSearch";
import { useFilteredGeojson, useHiddenOverflow } from "./../utils/helpers";
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

  if (name === "selectedFeature" && value) {
    return {
      ...state,
      sidebar: true,
      details: true,
      listSearch: false,
      map: !isSmallScreen,
    };
  } else if (name === "selectedFeature" && !value) {
    return { ...state, details: false, listSearch: true };
  } else if (name === "showList" && value) {
    return {
      ...state,
      sidebar: true,
      listSearch: true,
      details: true,
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

export default function MapList({
  initialFilters,
  PopUpContent,
  DetailsContent,
  ListItemContent,
  InfoContent,
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
    layoutReducer,
    initialLayout(isSmallScreen)
  );

  useEffect(() => {
    dispatchLayout({
      name: "selectedFeature",
      value: !!selectedFeature,
      isSmallScreen,
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
                  ((!layout.listSearch || selectedFeature) && "d-none") || ""
                }`}
                style={{ overflowY: "hidden" }}
              >
                <ListSearch
                  filters={filters}
                  setFilters={setFilters}
                  setSelectedFeature={setSelectedFeature}
                  hasSelectedFeature={!!selectedFeature}
                />
                <div className="px-3" style={{ overflowY: "scroll" }}>
                  <List
                    geojson={filteredGeosjon}
                    mapRef={mapRef}
                    setSelectedFeature={setSelectedFeature}
                    ListItemContent={ListItemContent}
                  />
                </div>
              </div>

              {/* extra page info */}
              {layout.info && <InfoContent />}

              {/* feature details */}
              {layout.details && selectedFeature && (
                <div className="px-2 pt-3" style={{ overflowY: "scroll" }}>
                  <DetailsContent
                    feature={selectedFeature}
                    setSelectedFeature={setSelectedFeature}
                  />
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
