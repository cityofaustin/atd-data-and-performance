import { shortenLocationName } from "../../../utils/helpers";
import {
  getColor,
  getOperationState,
} from "../../../page-settings/signal-monitor";
import { FaCircle } from "react-icons/fa";

export default function ListItemContent({ feature }) {
  const statusColor = getColor(feature);
  return (
    <div className="d-flex w-100 align-items-center justify-content-between">
      <span>
        <strong className="mb-1">
          {shortenLocationName(feature.properties.location_name)}
        </strong>
      </span>
      <div className="d-flex flex-column align-items-center flex-shrink-0">
        <div className="d-flex align-items-center">
          <small>
            <span className="me-1 text-muted">
              {getOperationState(feature)}
            </span>
            <span style={{ color: statusColor }}>
              <FaCircle />
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}
