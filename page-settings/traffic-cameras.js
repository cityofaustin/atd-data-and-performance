export const FILTERS = {
  checkbox: [
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
  ],
  search: {
    key: "search",
    value: "",
    featureProp: "location_name",
    label: "Search",
    placeholder: "Search by location...",
  },
};

const COLORS = {
  online: "#1f78b4",
  offline: "#a6cee3",
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
