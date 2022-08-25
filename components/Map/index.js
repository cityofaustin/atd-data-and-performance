import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import MapGL, { Source, Layer, NavigationControl, Popup } from "react-map-gl";
import {
  useIsTouchDevice,
  useIconMarkers,
  generateNewQueryparams,
  applyCustomStyles,
  useInitialViewState,
} from "../../utils/helpers";
import { MAP_SETTINGS_DEFAULT, SHOW_MARKERS_ZOOM_LEVEL } from "./settings";
import IconLabel from "../IconLabel";
import { FaExpand } from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map({
  geojson,
  mapRef,
  selectedFeature,
  setSelectedFeature,
  PopUpContent,
  PopUpHoverContent,
  layerStyles,
  isSmallScreen,
  getMapIcon,
  featurePk,
}) {
  const router = useRouter();
  const [cursor, setCursor] = useState("grab");
  const [hoverFeature, setHoverFeature] = useState(null);
  const isTouchDevice = useIsTouchDevice();

  const customStyles = useMemo(
    () => applyCustomStyles(layerStyles || {}),
    [layerStyles]
  );
  const initialViewState = useInitialViewState(router.query);
  const [showMarkers, setShowMarkers] = useState(
    initialViewState.zoom >= SHOW_MARKERS_ZOOM_LEVEL
  );
  const markers = useIconMarkers({ geojson, getMapIcon, featurePk });

  const onMouseEnter = useCallback((e) => {
    setCursor("pointer");
    setHoverFeature(e.features[0]), [];
  }, []);

  const onMouseLeave = useCallback(() => {
    setCursor("grab");
    setHoverFeature(null), [];
  }, []);

  const onZoomEnd = useCallback(
    (e) => {
      const qparams = generateNewQueryparams(e.viewState);
      router.replace({ pathname: router.pathname, query: qparams });
      if (
        e.viewState.zoom >= SHOW_MARKERS_ZOOM_LEVEL &&
        getMapIcon &&
        !showMarkers
      ) {
        setShowMarkers(true);
      } else if (
        e.viewState.zoom < SHOW_MARKERS_ZOOM_LEVEL &&
        getMapIcon &&
        showMarkers
      ) {
        setShowMarkers(false);
      }
    },
    [showMarkers, getMapIcon, router]
  );

  return (
    <MapGL
      ref={mapRef}
      reuseMaps
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        if (e.features.length) {
          setSelectedFeature(e.features[0]);
        } else {
          setSelectedFeature(null);
        }
      }}
      onZoomEnd={onZoomEnd}
      cursor={cursor}
      initialViewState={initialViewState}
      {...MAP_SETTINGS_DEFAULT}
    >
      {selectedFeature && !isSmallScreen && (
        <Popup
          longitude={selectedFeature.geometry.coordinates[0]}
          latitude={selectedFeature.geometry.coordinates[1]}
          onClose={() => setSelectedFeature(null)}
          // i don't know why we need closeOnClick = false (it doesn't obey), but
          // the popup won't render after multiple map feature click without it :/
          closeOnClick={false}
          maxWidth={"300px"}
          anchor="bottom"
        >
          <PopUpContent feature={selectedFeature} />
        </Popup>
      )}
      {hoverFeature &&
        selectedFeature?.properties[featurePk] !==
          hoverFeature.properties[featurePk] && (
          <Popup
            longitude={hoverFeature.geometry.coordinates[0]}
            latitude={hoverFeature.geometry.coordinates[1]}
            closeButton={false}
          >
            <PopUpHoverContent feature={hoverFeature} />
            {isTouchDevice && (
              <div
                className="d-flex justify-content-center align-items-center bg-primary text-white p-2"
                role="button"
                onClick={() => setSelectedFeature(hoverFeature)}
              >
                <IconLabel Icon={FaExpand} label="Details" />
              </div>
            )}
          </Popup>
        )}
      {showMarkers && markers}
      <NavigationControl position="bottom-right" />
      <Source id="my-data" type="geojson" data={geojson || { features: [] }}>
        <Layer {...customStyles} />
      </Source>
    </MapGL>
  );
}
