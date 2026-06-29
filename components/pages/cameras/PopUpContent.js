import Card from "react-bootstrap/Card";
import FlexyInfo from "../../FlexyInfo";
import { shortenLocationName } from "../../../utils/helpers";
import Thumbnail from "../../Thumbnail";

const CCTV_SERVICE_ENDPOINT =
  process.env.NEXT_PUBLIC_CCTV_SERVICE_ENDPOINT || "http://10.66.2.214:5001";

export default function PopUpContent({ feature }) {
  return (
    <Card className="h-100 nav-tile">
      <Thumbnail cameraId={feature.properties.camera_id} />
      <Card.Body>
        <Card.Title className="fw-bold fs-6 pb-2 border-bottom">
          {shortenLocationName(feature.properties.location_name)}
        </Card.Title>
        <FlexyInfo label="Status" value={feature.properties.status} />
        <FlexyInfo
          label="Live stream"
          value={
            <small>
              <a
                href={`${CCTV_SERVICE_ENDPOINT}/camera/${feature.properties.camera_id}`}
                target="_blank"
                rel="noreferrer"
              >
                Restricted access
              </a>
            </small>
          }
        />
      </Card.Body>
    </Card>
  );
}
