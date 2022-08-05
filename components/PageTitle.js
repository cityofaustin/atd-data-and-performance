import { FaInfoCircle } from "react-icons/fa";

export default function PageTitle({ title, onClick }) {
  return (
    <div className="d-flex justify-content-start">
      <span className="fs-2 fw-bold text-primary my-2 ps-2">{title}</span>
      {onClick && (
        <span
          className="text-secondary align-self-center m-2 fs-5"
          style={{ cursor: "pointer" }}
          onClick={onClick}
        >
          <FaInfoCircle />
        </span>
      )}
    </div>
  );
}
