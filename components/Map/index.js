import { useState, useCallback, useEffect } from "react";
import MapGL, { Source, Layer, NavigationControl, Popup } from "react-map-gl";
import { MAP_SETTINGS_DEFAULT, LAYER_STYLE_DEFAULT } from "./settings";
import "mapbox-gl/dist/mapbox-gl.css";

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
}) {
  const [cursor, setCursor] = useState("grab");
  const [hoverFeature, setHoverFeature] = useState(null);

  const onMouseEnter = useCallback((e) => {
    setCursor("pointer");
    setHoverFeature(e.features[0]), [];
  }, []);
  const onMouseLeave = useCallback(() => {
    setCursor("grab");
    setHoverFeature(null), [];
  }, []);

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
          </Popup>
        )}
      <NavigationControl />
      <Source id="my-data" type="geojson" data={geojson || { features: [] }}>
        <Layer {...applyCustomStyles(layerStyles || {})} />
      </Source>
    </MapGL>
  );
}
