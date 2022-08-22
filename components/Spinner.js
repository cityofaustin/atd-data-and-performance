import { Spinner as BsSpinner } from "react-bootstrap";

/**
 * A spinner positioned in the center of the screen
 */
export default function Spinner() {
  return (
    <div
      style={{ position: "absolute", top: "40%", left: "0px", right: "0px" }}
      className="d-flex justify-content-center"
    >
      <BsSpinner className="text-secondary" animation="border" role="status" />
      <span className="ms-2 align-top text-dts-dark-gray">Loading...</span>
    </div>
  );
}
