import { shortenLocationName } from "../../../utils/helpers";
import { getSettings } from "../../../page-settings/signal-evaluations";
import { FaCircle } from "react-icons/fa";

export default function ListItemContent({ feature }) {
  const settings = getSettings(feature);
  const Icon = settings.icon;
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
            <span className="me-1 text-muted">{settings.label}</span>
            <span className="me-1 text-muted">
              <Icon />
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}
