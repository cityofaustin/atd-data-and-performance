import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Thumbnail from "../../Thumbnail";
import FlexyInfo from "../../FlexyInfo";
import DetailsHeader from "../../DetailsHeader";
import { shortenLocationName } from "../../../utils/helpers";

export default function DetailsContent({ feature, setSelectedFeature }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <ListGroup variant="flush" className="px-3 border-start border-5">
      <ListGroup.Item>
        <DetailsHeader
          title={shortenLocationName(feature.properties.location_name)}
          subtitle="Camera"
          setSelectedFeature={setSelectedFeature}
        />
      </ListGroup.Item>
      <ListGroup.Item>
        <FlexyInfo label="Status" value={feature.properties.status} />
      </ListGroup.Item>
      <ListGroup.Item>
        <FlexyInfo label="Camera ID" value={feature.properties.camera_id} />
      </ListGroup.Item>
      <ListGroup.Item>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(!showModal)}
        >
          <Thumbnail cameraId={feature.properties.camera_id} />
        </div>
      </ListGroup.Item>
      <ListGroup.Item>
        <small>
          <a
            href={`http://10.66.2.64:8000/?cam_id=${feature.properties.camera_id}`}
            target="_blank"
            rel="noreferrer"
          >
            Live stream
          </a>{" "}
          (Restricted Access)
        </small>
      </ListGroup.Item>
    </ListGroup>
  );
}
