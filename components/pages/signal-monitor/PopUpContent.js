import Card from "react-bootstrap/Card";
import FlexyInfo from "../../FlexyInfo";
import { shortenLocationName } from "../../../utils/helpers";
import { getOperationState } from "../../../page-settings/signal-monitor";
import humanizeDuration from "humanize-duration";

const formatDuration = (feature, now) => {
  const duration = humanizeDuration(
    now.getTime() -
      new Date(feature.properties.operation_state_datetime).getTime(),
    { largest: 1 }
  );
  return `${duration} ago`;
};

export default function PopUpContent({ feature }) {
  const now = new Date();
  return (
    <Card className="h-100 nav-tile">
      <Card.Body>
        <Card.Title className="fw-bold fs-6 pb-2 border-bottom">
          {shortenLocationName(feature.properties.location_name)}
        </Card.Title>
        <FlexyInfo label="Status" value={getOperationState(feature)} />
        <FlexyInfo label="Updated" value={formatDuration(feature, now)} />
      </Card.Body>
    </Card>
  );
}
