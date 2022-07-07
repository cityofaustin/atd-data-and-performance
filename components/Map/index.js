import { useState, useCallback } from "react";
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
  layerStyles,
}) {
  const [cursor, setCursor] = useState("grab");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);

  return (
    <MapGL
      ref={mapRef}
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
      {selectedFeature && (
        <Popup
          longitude={selectedFeature.geometry.coordinates[0]}
          latitude={selectedFeature.geometry.coordinates[1]}
          anchor="bottom"
          onClose={() => setSelectedFeature(null)}
          // i don't know why we need closeOnClick = false (it doesn't obey), but
          // the popup won't render after multiple map feature click without it :/
          closeOnClick={false}
        >
          <PopUpContent feature={selectedFeature} />
        </Popup>
      )}
      <NavigationControl />
      <Source id="my-data" type="geojson" data={geojson || { features: [] }}>
        <Layer {...applyCustomStyles(layerStyles || {})} />
      </Source>
    </MapGL>
  );
}
