import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CloseButton from "react-bootstrap/CloseButton";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "../../styles/Map.module.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const MAP_OPTIONS = {
  center: [-97.74, 30.28],
  zoom: 11,
  style: "mapbox://styles/mapbox/light-v10",
  maxZoom: 18,
  pitchWithRotate: false,
  dragRotate: false,
  maxBounds: [
    [-98.27, 30.05],
    [-97.18318, 30.49],
  ],
};

const POINT_LAYER_OPTIONS_DEFAULT = {
  id: "points",
  type: "circle",
  source: "points",
  paint: {
    "circle-radius": {
      stops: [
        [10, 5],
        [16, 15],
      ],
    },
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 2,
    "circle-stroke-opacity": 0.9,
    "circle-color": "#607d8f",
    "circle-opacity": 0.9,
  },
};

export const addPointLayer = ({ map, layer, geojson, onFeatureClick }) => {
  if (map.getLayer(layer.id)) {
    map.removeLayer(layer.id);
  }

  if (map.getSource(layer.id)) {
    map.removeSource(layer.id);
  }
  /* merge paint properties separately to allow individual default paint properties
  to be overrided */
  layer.paint = {
    ...POINT_LAYER_OPTIONS_DEFAULT.paint,
    ...(layer.paint || {}),
  };

  layer = { ...POINT_LAYER_OPTIONS_DEFAULT, ...layer };

  map.addSource(layer.id, {
    type: "geojson",
    data: geojson,
  });

  map.addLayer(layer);

  map.on("mouseenter", layer.id, function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", layer.id, function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("click", layer.id, onFeatureClick);
};

const Marker = ({ map, feature }) => {
  const markerRef = useRef();

  useEffect(() => {
    const marker = new mapboxgl.Marker(markerRef)
      .setLngLat([
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ])
      .addTo(map);
    return () => marker.remove();
  });

  return <div ref={markerRef} />;
};

export const easeToFeature = (map, feature) => {
  map.easeTo({
    center: feature.geometry.coordinates,
    zoom: 13,
    duration: 1000,
  });
};

const useMap = (mapContainerRef, mapRef) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      ...MAP_OPTIONS,
    });
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    mapRef.current.once("load").then(() => setIsMapLoaded(true));
    return () => mapRef.current.remove();
  }, []);
  return isMapLoaded;
};

const MapOverlay = ({ feature, setSelectedFeature }) => {
  return (
    <div className={styles["map-overlay"]}>
      <div className="list-group">
        <div className="list-group-item " aria-current="true">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1"><span className="text-dts-4"><FaMapMarkerAlt/></span> {feature.properties.location_name}</h5>
            <CloseButton onClick={() => setSelectedFeature(null)} />
          </div>
          <p className="mb-1">{feature.properties.signal_status}</p>
        </div>
      </div>
    </div>
  );
};

export default function Map({
  geojson,
  layerStyle,
  mapContainerRef,
  mapRef,
  selectedFeature,
  setSelectedFeature,
  onFeatureClick,
}) {
  const isMapLoaded = useMap(mapContainerRef, mapRef);

  useEffect(() => {
    isMapLoaded &&
      geojson &&
      addPointLayer({
        map: mapRef.current,
        layer: layerStyle,
        geojson: geojson,
        onFeatureClick: onFeatureClick,
      });
  }, [mapRef.current, geojson, isMapLoaded]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on("click", () => {
      setSelectedFeature(null);
    });
  }, [mapRef.current]);

  return (
    <div className={styles["map-container"]} ref={mapContainerRef}>
      {selectedFeature && (
        <>
          <MapOverlay
            feature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
          />
          <Marker map={mapRef.current} feature={selectedFeature} />
        </>
      )}
    </div>
  );
}
