import { useState, useCallback, useMemo } from "react";
import MapGL, {
  Source,
  Layer,
  NavigationControl,
  Popup,
  Marker,
} from "react-map-gl";
import { useIsTouchDevice } from "../../utils/helpers";
import { MAP_SETTINGS_DEFAULT, LAYER_STYLE_DEFAULT } from "./settings";
import IconLabel from "../IconLabel";
import { FaExpand } from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaTimes } from "react-icons/fa";
import { getSettings } from "../../page-settings/signal-evaluations";

const SHOW_MARKERS_ZOOM_LEVEL = 12;

const applyCustomStyles = (layerStyles) => {
  // merge paint props separately to allow individual paint overrides
  layerStyles.paint = {
    ...LAYER_STYLE_DEFAULT.paint,
    ...(layerStyles.paint || {}),
  };
  // merge any other overrides
  return { ...LAYER_STYLE_DEFAULT, ...layerStyles };
};

export default function Map({
  geojson,
  mapRef,
  selectedFeature,
  setSelectedFeature,
  PopUpContent,
  PopUpHoverContent,
  layerStyles,
  isSmallScreen,
  hasIconMarkers,
}) {
  const [showMarkers, setShowMarkers] = useState(false);
  const [cursor, setCursor] = useState("grab");
  const [hoverFeature, setHoverFeature] = useState(null);
  const isTouchDevice = useIsTouchDevice();
  const onMouseEnter = useCallback((e) => {
    setCursor("pointer");
    setHoverFeature(e.features[0]), [];
  }, []);
  const onMouseLeave = useCallback(() => {
    setCursor("grab");
    setHoverFeature(null), [];
  }, []);

  const customStyles = useMemo(
    () => applyCustomStyles(layerStyles || {}),
    [layerStyles]
  );

  const markers = useMemo(() => {
    if (!geojson || !hasIconMarkers) return;
    return geojson.features.map((feature) => {
      const f = getSettings(feature);
      const Icon = f.mapIcon;
      return (
        <Marker
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          anchor="center"
          style={{ cursor: "pointer" }}
        >
          <span className="text-white">
            <Icon style={{ marginBottom: "4px" }} />
          </span>
        </Marker>
      );
    });
  }, [geojson]);

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
      onZoomEnd={(e) => {
        if (
          e.viewState.zoom >= SHOW_MARKERS_ZOOM_LEVEL &&
          hasIconMarkers &&
          !showMarkers
        ) {
          setShowMarkers(true);
        } else if (
          e.viewState.zoom < SHOW_MARKERS_ZOOM_LEVEL &&
          hasIconMarkers &&
          showMarkers
        ) {
          setShowMarkers(false);
        }
      }}
      cursor={cursor}
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
        selectedFeature?.properties.camera_id !==
          hoverFeature.properties.camera_id && (
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
