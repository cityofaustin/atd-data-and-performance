import { useMemo } from "react";

export const COLORS = {
  online: "#08306b",
  offline: "#6baed6",
};

export const FILTER_SETTINGS = [
  {
    key: "online",
    value: "online",
    featureProp: "status",
    label: "Online",
    checked: true,
    color: COLORS.online,
  },
  {
    key: "offline",
    value: "offline",
    featureProp: "status",
    label: "Offline",
    checked: true,
    color: COLORS.offline,
  },
];

export const SEARCH_SETTINGS = {
  featureProp: "location_name",
  placeholder: "Search by location...",
};

export const LAYER_STYLES = {
  paint: {
    "circle-color": [
      "match",
      ["get", "status"],
      "online",
      COLORS.online,
      /* other */ COLORS.offline,
    ],
  },
};

export const STATUS_STYLES = {
  online: {
    label: "Online",
    borderColor: COLORS.online,
    color: COLORS.online,
  },
  offline: {
    label: "Offline",
    borderColor: COLORS.offline,
    color: COLORS.offline,
  },
};

const simplifyStatus = (status) => {
  switch (status) {
    case "online":
      return status;
    default:
      return "offline";
  }
};

/**
 * Update camera records with their status
 * @param {object} cameras - a geojson FeatureCollection of camera records
 * @param {[object]} statuses - an array of device status objects
 * @returns {object} the cameras FeatureCollection with a `status` property added to each feature
 */
export const useCommStatus = ({ cameras, statuses }) =>
  useMemo(() => {
    if (!cameras || !statuses) {
      return;
    }
    cameras.features.forEach((feature) => {
      const id = parseInt(feature.properties.camera_id);
      /**
       * the `statuses` object may contain multiple records per camera
       * we are assuming the status records are sorted by timestampe descending
       * and taking the first value we find. see the docs in utils/queries for
       * more info about the status query
       */
      const statusMatch = statuses.find(
        (status) => parseInt(status.device_id) === id
      );
      feature.properties.status = simplifyStatus(statusMatch?.status_desc);
    });
    return cameras;
  }, [cameras, statuses]);
