import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import JobsTable from "./JobsTable";
import { POSTGREST_ENDPOINT } from "../../../page-settings/publisher";

export default function JobModal({ selectedJobName, setSelectedJobName }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loading = !error && !data;

  useEffect(() => {
    const url = `${POSTGREST_ENDPOINT}/jobs?name=eq.${selectedJobName}&order=start_date.desc&limit=25`;
    fetch(url)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("something went wrong :/");
          return;
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        setError(error);
      });
  }, [selectedJobName]);

  return (
    <Modal
      show={true}
      animation={false}
      onHide={() => setSelectedJobName(null)}
      size="lg"
    >
      <Modal.Header closeButton>
        <span className="fw-bold me-2">Job: </span>
        <span className="font-monospace">{selectedJobName}</span>
      </Modal.Header>
      <Modal.Body>
        <JobsTable data={data} loading={loading} error={error} />
      </Modal.Body>
    </Modal>
  );
}
