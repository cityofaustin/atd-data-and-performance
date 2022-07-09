import Button from "react-bootstrap/Button";
import { FaTimesCircle } from "react-icons/fa";
import IconLabel from "./IconLabel";

const CloseDetailsButton = ({ setSelectedFeature }) => (
  <Button
    size="sm"
    variant="outline-secondary"
    onClick={() => setSelectedFeature(null)}
  >
    <IconLabel Icon={FaTimesCircle} label="Close" />
  </Button>
);

export default function DetailsHeader({ title, subtitle, setSelectedFeature }) {
  return (
    <div className="d-flex justify-content-between">
      <div>
        <span className="fs-5 fw-bold me-2">{title}</span>
        {subtitle && <span className="text-muted fst-italic">{subtitle}</span>}
      </div>
      <div>
        <CloseDetailsButton setSelectedFeature={setSelectedFeature} />
      </div>
    </div>
  );
}
