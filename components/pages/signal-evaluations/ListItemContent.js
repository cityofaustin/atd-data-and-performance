import { shortenLocationName } from "../../../utils/helpers";
import { getSettings } from "../../../page-settings/signal-evaluations";
import { FaCircle } from "react-icons/fa";

export default function ListItemContent({ feature }) {
  const settings = getSettings(feature);
  const Icon = settings.icon;
  return (
    <div className="d-flex w-100 justify-content-between">
      <span>
        <strong className="mb-1">
          {shortenLocationName(feature.properties.location_name)}
        </strong>
      </span>
      <div className="d-flex align-items-center flex-shrink-0  text-muted">
        <span className="me-1" style={{ fontSize: "0.8em" }}>
          {settings.label}
        </span>
        <Icon style={{ fontSize: "0.8em" }} />
      </div>
    </div>
  );
}
