import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import FlexyInfo from "../../FlexyInfo";
import { shortenLocationName } from "../../../utils/helpers";

export default function DetailsContent({ feature }) {
  const src = `https://cctv.austinmobility.io/image/${feature.properties.camera_id}.jpg`;
  return (
    <Card className="h-100 nav-tile">
      <Card.Img variant="top" alt="Camera thumbnail" src={src} />
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
                href={`http://10.66.2.64:8000/?cam_id=${feature.properties.camera_id}`}
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
