import { FaExclamationTriangle, FaClock, FaPhone, FaTimes } from "react-icons/fa";

const COLORS = {
  red: "#c41213",
  orange: "#f29900",
  blue: "#377eb8",
  black: "#000000",
};

const OPERATION_STATES = [
  {
    key: "unscheduled_flash",
    value: "2",
    label: "Unscheduled flash",
    color: COLORS.red,
    featureProp: "operation_state",
    checked: true,
    icon: FaExclamationTriangle,
  },
  {
    key: "scheduled_flash",
    value: "1",
    label: "Scheduled flash",
    color: COLORS.orange,
    featureProp: "operation_state",
    checked: true,
    icon: FaClock,
  },
  {
    key: "comm_outage",
    value: "3",
    label: "Comm. issue",
    color: COLORS.blue,
    featureProp: "operation_state",
    checked: true,
    icon: FaPhone,
  },
  {
    key: "dark_signal",
    value: "4",
    label: "Dark",
    color: COLORS.black,
    featureProp: "operation_state",
    checked: true,
    icon: FaTimes,
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
      ["get", "operation_state"],
      "1",
      OPERATION_STATES[1].color,
      "2",
      OPERATION_STATES[0].color,
      "3",
      OPERATION_STATES[2].color,
      "4",
      OPERATION_STATES[3].color,
      // fallback
      "#ccc",
    ],
  },
};

export const getOperationState = (feature) => {
  return OPERATION_STATES.find(
    (opState) => feature.properties.operation_state === opState.value
  );
};

export const getMapIcon = (feature) => {
  const setting = getOperationState(feature);
  return setting.icon;
};

export const FILTER_SETTINGS = [...OPERATION_STATES];
