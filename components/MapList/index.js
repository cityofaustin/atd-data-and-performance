import { useState, useRef, useReducer, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import FeatureModal from "../FeatureModal";
import List from "../List";
import ListSearch from "../ListSearch";
import Map from "../Map";
import Modal from "react-bootstrap/Modal";
import Nav from "../Nav";
import NavMobile from "../NavMobile";
import PageTitle from "../PageTitle";
import Spinner from "../Spinner";
import {
  MIN_FEATURE_ZOOM_TO,
  MAX_SMALL_SCREEN_WIDTH_PIXELS,
  getInitialLayout,
  layoutReducer,
} from "./settings";
import {
  useHiddenOverflow,
  useCheckboxFilters,
  useSearchValue,
  useFeatureCounts,
} from "../../utils/helpers";

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
  getMapIcon,
  featurePk,
}) {
  const [filters, setFilters] = useState(filterSettings);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const mapRef = useRef();

  const featureCounts = useFeatureCounts({ geojson, filters });

  // applies checkbox filter state to geojson
  const filteredGeosjon = useCheckboxFilters({
    geojson,
    filters,
  });

  // applies search filter to already-checkbox-filtered geojson
  const searchedGeojson = useSearchValue({
    geojson: filteredGeosjon,
    searchValue,
    ...searchSettings,
  });

  const isSmallScreen = useMediaQuery({
    maxWidth: MAX_SMALL_SCREEN_WIDTH_PIXELS,
  });

  // hids overflow on the document <body> while this component is mounted #noScrollBar
  useHiddenOverflow();

  // hook which manages layout element display state
  const [layout, dispatchLayout] = useReducer(
    layoutReducer,
    getInitialLayout(isSmallScreen)
  );

  // triggers pan + zoom when a feature is selected from the list or map
  useEffect(() => {
    if (!mapRef.current || !selectedFeature) return;
    const zoom = mapRef.current.getZoom();
    const maxZoom = zoom > MIN_FEATURE_ZOOM_TO ? zoom : MIN_FEATURE_ZOOM_TO;
    const { coordinates } = selectedFeature.geometry;
    mapRef.current.fitBounds([coordinates, coordinates], {
      padding: 100,
      duration: 1000,
      maxZoom: maxZoom,
      linear: true,
    });
  }, [selectedFeature]);

  // resets the layout if viewport crosses small screen threshold
  useEffect(() => {
    dispatchLayout({ name: "viewPortChange", isSmallScreen });
  }, [isSmallScreen]);

  // ensures the map canavs is always fully painted when activated
  // deals with the weird effects of changing/hiding the map container on small screen
  useEffect(() => {
    mapRef.current?.resize();
  }, [layout.map]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    // todo handle errors
    console.error(error);
  }
  return (
    <div className="wrapper-contained">
      <Nav />
      {isSmallScreen && (
        <NavMobile
          title={title}
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
                <div className="px-3">
                  <PageTitle
                    title={title}
                    onClick={() => dispatchLayout({ name: "info", show: true })}
                  />
                </div>
              )}
              {/* note the use of d-none (display: none) to hide elements. this avoids
              laborious re-renders */}
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
                  featureCounts={featureCounts}
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
              {/* page info content */}
              {layout.info && isSmallScreen && (
                <div className="px-3">
                  <PageTitle title={title} />
                  <InfoContent />
                </div>
              )}
              {layout.info && !isSmallScreen && (
                <Modal
                  show={true}
                  animation={false}
                  onHide={() => dispatchLayout({ name: "info", show: false })}
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
          {/* map container - note the use of d-none (display: none) to hide. this avoids
              laborious map re-render */}
          <div className={`map-container ${layout.map ? "" : "d-none"}`}>
            <Map
              geojson={filteredGeosjon}
              mapRef={mapRef}
              selectedFeature={selectedFeature}
              setSelectedFeature={setSelectedFeature}
              PopUpContent={PopUpContent}
              PopUpHoverContent={PopUpHoverContent}
              layerStyles={layerStyles}
              isSmallScreen={isSmallScreen}
              getMapIcon={getMapIcon}
              featurePk={featurePk}
            />
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
