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
    key: "Inactive",
    value: "Inactive",
    featureProp: "status_simple",
    label: "Inactive",
    checked: true,
    color: COLORS.zero,
    icon: FaRegTimesCircle,
  },
  {
    key: "Active",
    value: "Active",
    featureProp: "status_simple",
    label: "Active",
    checked: true,
    color: COLORS.one,
    icon: FaSearch,
  },
  {
    key: "Engineering study",
    value: "Engineering study",
    featureProp: "status_simple",
    label: "Engineering study",
    checked: true,
    color: COLORS.two,
    icon: FaCalculator,
  },
  {
    key: "Not recommended",
    value: "Not recommended",
    featureProp: "status_simple",
    label: "Not recommended",
    checked: true,
    color: COLORS.three,
    icon: FaRegTimesCircle,
  },
  {
    key: "Needs funding",
    value: "Needs funding",
    featureProp: "status_simple",
    label: "Needs funding",
    checked: true,
    color: COLORS.four,
    icon: FaDollarSign,
  },
  {
    key: "Ready for design",
    value: "Ready for design",
    featureProp: "status_simple",
    label: "Ready for design",
    checked: true,
    color: COLORS.five,
    icon: FaCheckCircle,
  },
];

export const STATUS_DEFS = [
  {
    location_statuses: ["archived", "ineligible"],
    status_simple: "Inactive",
  },
  {
    location_statuses: ["recently received", "evaluated"],
    status_simple: "Active",
  },
  {
    location_statuses: ["study in progress", "selected for study"],
    status_simple: "Engineering study",
  },
  {
    location_statuses: ["not recommended"],
    status_simple: "Not recommended",
  },
  {
    location_statuses: ["recommended (needs funding)"],
    status_simple: "Needs funding",
  },
  {
    location_statuses: ["recommended (funded)"],
    status_simple: "Ready for design",
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
      ["get", "status_simple"],
      "Inactive",
      COLORS.zero,
      "Active",
      COLORS.one,
      "Engineering study",
      COLORS.two,
      "Not recommended",
      COLORS.three,
      "Needs funding",
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
    (setting) => feature.properties.status_simple === setting.value
  );
};
