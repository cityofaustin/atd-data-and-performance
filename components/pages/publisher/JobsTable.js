import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import { FIELDS } from "../../../page-settings/publisher";

export default function JobsTable({
  data,
  loading,
  error,
  setSelectedJobName,
  fieldFilter,
}) {
  const tableFields = FIELDS.filter((field) => field[fieldFilter]);

  return (
    <Table size="sm" striped hover responsive>
      <thead>
        <tr>
          {tableFields.map((field) => (
            <th key={field.key}>{field.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan={tableFields.length} className="text-center">
              <Spinner animation="border" variant="primary" />
            </td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan={tableFields.length} className="text-center">
              Something went wrong. Check the console for details.
            </td>
          </tr>
        )}
        {!error &&
          data &&
          data?.map((job) => (
            <tr
              key={job.id}
              style={{ cursor: setSelectedJobName ? "pointer" : "auto" }}
              onClick={() =>
                setSelectedJobName && setSelectedJobName(job?.name)
              }
            >
              {tableFields.map((field) => (
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
