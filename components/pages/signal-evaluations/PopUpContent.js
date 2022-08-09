import Card from "react-bootstrap/Card";
import FlexyInfo from "../../FlexyInfo";
import { shortenLocationName } from "../../../utils/helpers";
import { getSettings } from "../../../page-settings/signal-evaluations";
import humanizeDuration from "humanize-duration";
import IconLabel from "../../IconLabel";
const formatDuration = (feature, now) => {
  const duration = humanizeDuration(
    now.getTime() - new Date(feature.properties.modified_date).getTime(),
    { largest: 1 }
  );
  return `${duration} ago`;
};

export default function PopUpContent({ feature }) {
  const settings = getSettings(feature);
  const Icon = settings.icon;
  const now = new Date();
  return (
    <Card className="h-100 nav-tile">
      <Card.Body>
        <Card.Title className="fw-bold fs-6 pb-2 border-bottom">
          {shortenLocationName(feature.properties.location_name)}
        </Card.Title>
        <FlexyInfo
          label="Status"
          value={<IconLabel Icon={Icon} label={settings.label} />}
        />
        <FlexyInfo label="Updated" value={formatDuration(feature, now)} />
      </Card.Body>
    </Card>
  );
}