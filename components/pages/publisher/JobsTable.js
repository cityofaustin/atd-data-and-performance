import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";

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

const fields = [
  { label: "name", key: "name" },
  { label: "start_date", key: "start_date", handler: dateHandler },
  { label: "end_date", key: "end_date", handler: dateHandler },
  { label: "status", key: "status", handler: statusHandler },
  { label: "message", key: "message" },
  { label: "records_processed", key: "records_processed" },
  { label: "source", key: "source" },
  { label: "destination", key: "destination" },
];

export default function JobsTable({
  data,
  loading,
  error,
  setSelectedJobName,
  searchValue,
}) {
  let filteredData = data;
  if (searchValue) {
    filteredData = data.filter((job) =>
      job.name.includes(searchValue.toLowerCase())
    );
  }
  return (
    <Table size="sm" striped hover responsive>
      <thead>
        <tr>
          {fields.map((field) => (
            <th key={field.key}>{field.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan={fields.length} className="text-center">
              <Spinner animation="border" variant="primary" />
            </td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan={fields.length} className="text-center">
              Something went wrong. Check the console for details.
            </td>
          </tr>
        )}
        {!error &&
          filteredData &&
          filteredData?.map((job) => (
            <tr
              key={job.id}
              style={{ cursor: setSelectedJobName ? "pointer" : "auto" }}
              onClick={() =>
                setSelectedJobName && setSelectedJobName(job?.name)
              }
            >
              {fields.map((field) => (
                <td key={field.key}>
                  {field.handler
                    ? field.handler(job[field.key])
                    : job[field.key]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </Table>
  );
}
