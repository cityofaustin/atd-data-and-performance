import Badge from "react-bootstrap/Badge";

export const POSTGREST_ENDPOINT =
  "https://atd-postgrest.austinmobility.io/legacy-scripts";

const dateHandler = (date) => new Date(date).toLocaleString();

const getStatusClass = (status) => {
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "danger";
    default:
      "primary";
  }
};

const statusHandler = (status) => {
  const className = getStatusClass(status);
  return <Badge bg={className}>{status}</Badge>;
};

export const FIELDS = [
  { label: "name", key: "name", main: true, modal: false },
  {
    label: "start_date",
    key: "start_date",
    handler: dateHandler,
    main: true,
    modal: true,
  },
  {
    label: "end_date",
    key: "end_date",
    handler: dateHandler,
    main: true,
    modal: true,
  },
  {
    label: "status",
    key: "status",
    handler: statusHandler,
    main: true,
    modal: true,
  },
  {
    label: "records_processed",
    key: "records_processed",
    main: true,
    modal: true,
  },
  { label: "source", key: "source", main: true, modal: false },
  { label: "destination", key: "destination", main: true, modal: false },
  { label: "message", key: "message", main: false, modal: true },
];
