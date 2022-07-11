import Card from "react-bootstrap/Card";
import { shortenLocationName } from "../../../utils/helpers";

export default function DetailsContent({ feature }) {
  const src = `https://cctv.austinmobility.io/image/${feature.properties.camera_id}.jpg`;
  return (
    <Card className="h-100 nav-tile">
      <Card.Img variant="top" alt="Camera thumbnail" src={src} />
      <Card.Body className="p-3 lh-1">
        <Card.Title className="fw-bold fs-6 text-primary">
          {shortenLocationName(feature.properties.location_name)}
        </Card.Title>
        <span className="text-muted ">
          <small>hello</small>
        </span>
      </Card.Body>
    </Card>
  );
}
