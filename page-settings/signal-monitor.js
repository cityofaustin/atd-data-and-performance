import { FaExclamationTriangle, FaClock, FaPhone } from "react-icons/fa";

const COLORS = {
  red: "#e41a1c",
  lightRed: "#e05557",
  orange: "#ff7f00",
  lightOrange: "#ffa54d",
  blue: "#377eb8",
  lightBlue: "#578eba",
};

const OPERATION_STATES = [
  {
    key: "unscheduled_flash",
    value: "2",
    label: "Unscheduled flash",
    color: COLORS.red,
    backgroundColor: COLORS.lightRed,
    featureProp: "operation_state",
    checked: true,
    icon: FaExclamationTriangle,
  },
  {
    key: "scheduled_flash",
    value: "1",
    label: "Scheduled flash",
    color: COLORS.orange,
    backgroundColor: COLORS.lightOrange,
    featureProp: "operation_state",
    checked: true,
    icon: FaClock,
  },
  {
    key: "comm_outage",
    value: "3",
    label: "Communication issue",
    color: COLORS.blue,
    backgroundColor: COLORS.lightBlue,
    featureProp: "operation_state",
    checked: true,
    icon: FaPhone,
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
      ["get", "operation_state"],
      "1",
      OPERATION_STATES[1].color,
      "2",
      OPERATION_STATES[0].color,
      "3",
      OPERATION_STATES[2].color,
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

export const FILTER_SETTINGS = [...OPERATION_STATES];
