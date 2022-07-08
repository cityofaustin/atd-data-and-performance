import { useState, useRef, useReducer, useEffect } from "react";
import CloseButton from "react-bootstrap/CloseButton";
import { useMediaQuery } from "react-responsive";
import Map from "./Map";
import List from "./List";
import Nav from "./Nav";
import NavMobile from "./NavMobile";
import ListSearch from "./ListSearch";
import { useFilteredGeojson } from "./../utils/helpers";

const initialLayout = (isSmallScreen) => ({
  map: true,
  listSearch: true,
  details: false,
  sidebar: !isSmallScreen,
  title: !isSmallScreen,
  info: false,
});

const stateReducer = (state, action) => {
  if (action.selectedFeature === true) {
    return { ...state, details: true, listSearch: false };
  } else if (action.selectedFeature === false) {
    return { ...state, details: false, listSearch: true };
  } else if (action.showList === true) {
    return {
      ...state,
      sidebar: true,
      listSearch: true,
      details: false,
      map: false,
      info: false,
    };
  } else if (action.showList === false) {
    return { ...state, sidebar: false, map: true, info: false };
  } else if (action.showInfo === true) {
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
  <div className="p-3">
    <span className="fs-2 fw-bold text-secondary"> | </span>
    <span className="fs-2 fw-bold text-primary">{title}</span>
  </div>
);

export default function MapList({
  initialFilters,
  PopUpContent,
  DetailsContent,
  ListItem,
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
    stateReducer,
    initialLayout(isSmallScreen)
  );

  useEffect(() => {
    dispatchLayout({ selectedFeature: !!selectedFeature });
  }, [selectedFeature]);

  return (
    <div className="wrapper-contained">
      <Nav />
      {isSmallScreen && (
        <NavMobile
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
              {layout.title && <PageTitle title="Traffic cameras" />}

              {/* search */}
              {layout.listSearch && (
                <>
                  <div>
                    <ListSearch
                      filters={filters}
                      setFilters={setFilters}
                      setSelectedFeature={setSelectedFeature}
                      hasSelectedFeature={!!selectedFeature}
                    />
                  </div>

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
                </>
              )}

              {/* extra page info */}
              {layout.info && <InfoContent />}

              {/* feature details in sidebar */}
              {layout.details && selectedFeature && (
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
