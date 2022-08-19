import {
  FaRegTimesCircle,
  FaTimes,
  FaCheckCircle,
  FaCheck,
  FaCalculator,
  FaDollarSign,
} from "react-icons/fa";

const COLORS = {
  one: "#08306b",
  two: "#08306b",
  three: "#14376c",
  four: "#08306b",
};

export const FILTER_SETTINGS = [
  {
    key: "Not recommended",
    value: "Not recommended",
    featureProp: "location_status_simple",
    label: "Not recommended",
    checked: true,
    color: COLORS.zero,
    icon: FaRegTimesCircle,
    mapIcon: FaTimes,
  },
  {
    key: "Engineering study",
    value: "Engineering study",
    featureProp: "location_status_simple",
    label: "Engineering study",
    checked: true,
    color: COLORS.two,
    icon: FaCalculator,
    mapIcon: FaCalculator,
  },

  {
    key: "Needs funding",
    value: "Recommended (needs funding)",
    featureProp: "location_status_simple",
    label: "Needs funding",
    checked: true,
    color: COLORS.three,
    icon: FaDollarSign,
    mapIcon: FaDollarSign,
  },
  {
    key: "Ready for design",
    value: "Ready for design",
    featureProp: "location_status_simple",
    label: "Ready for design",
    checked: true,
    color: COLORS.five,
    icon: FaCheckCircle,
    mapIcon: FaCheck,
  },
];

export const SEARCH_SETTINGS = {
  featureProp: "location_name",
  label: "Search",
  placeholder: "Search by location...",
};

export const LAYER_STYLES = {
  paint: {
    "circle-color": [
      "match",
      ["get", "location_status_simple"],
      "Not recommended",
      COLORS.one,
      "Engineering study",
      COLORS.two,
      "Recommended (needs funding)",
      COLORS.three,
      "Ready for design",
      COLORS.four,
      // fallback
      "#ccc",
    ],
  },
};

export const getSettings = (feature) => {
  return FILTER_SETTINGS.find(
    (setting) => feature.properties.location_status_simple === setting.value
  );
};

export const getMapIcon = (feature) => {
  const setting = FILTER_SETTINGS.find(
    (setting) => feature.properties.location_status_simple === setting.value
  );
  return setting.mapIcon;
};
