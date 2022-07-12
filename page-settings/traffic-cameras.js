export const FILTER_SETTINGS = [
  {
    key: "online",
    value: "online",
    featureProp: "status",
    label: "Online",
    checked: true,
  },
  {
    key: "offline",
    value: "offline",
    featureProp: "status",
    label: "Offline",
    checked: false,
  },
];

export const SEARCH_SETTINGS = {
  featureProp: "location_name",
  label: "Search",
  placeholder: "Search by location...",
};

export const COLORS = {
  online: "#08306b",
  offline: "#6baed6",
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
