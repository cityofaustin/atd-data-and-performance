export const SHOW_MARKERS_ZOOM_LEVEL = 12;

/**
 * Mapbox layer style. See https://docs.mapbox.com/mapbox-gl-js/style-spec/
 */
export const LAYER_STYLE_DEFAULT = {
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

export const INITIAL_VIEW_STATE_DEFAULT = {
  latitude: 30.28,
  longitude: -97.74,
  zoom: 11,
};

/**
 * See: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
 */
export const MAP_SETTINGS_DEFAULT = {
  maxZoom: 20,
  touchPitch: false,
  dragRotate: false,
  maxBounds: [
    [-99, 29],
    [-96, 32],
  ],
  mapStyle: "https://tiles.openfreemap.org/styles/positron",
  interactiveLayerIds: ["points"],
};
