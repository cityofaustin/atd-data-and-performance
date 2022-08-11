import {
  FaRegTimesCircle,
  FaCheckCircle,
  FaSearch,
  FaCalculator,
  FaDollarSign,
} from "react-icons/fa";

const COLORS = {
  zero: "#ccc",
  one: "#00441b",
  two: "#00441b",
  three: "#00441b",
  four: "#00441b",
  five: "#00441b",
};

export const FILTER_SETTINGS = [
  {
    key: "Engineering study",
    value: "Engineering study",
    featureProp: "location_status_simple",
    label: "Engineering study",
    checked: true,
    color: COLORS.two,
    icon: FaCalculator,
  },
  {
    key: "Not recommended",
    value: "Not recommended",
    featureProp: "location_status_simple",
    label: "Not recommended",
    checked: true,
    color: COLORS.three,
    icon: FaRegTimesCircle,
  },
  {
    key: "Needs funding",
    value: "Recommended (needs funding)",
    featureProp: "location_status_simple",
    label: "Needs funding",
    checked: true,
    color: COLORS.four,
    icon: FaDollarSign,
  },
  {
    key: "Ready for design",
    value: "Ready for design",
    featureProp: "location_status_simple",
    label: "Ready for design",
    checked: true,
    color: COLORS.five,
    icon: FaCheckCircle,
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
      "Engineering study",
      COLORS.two,
      "Not recommended",
      COLORS.three,
      "Recommended (needs funding)",
      COLORS.four,
      "Ready for design",
      COLORS.five,
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
