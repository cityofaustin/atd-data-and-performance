import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Thumbnail from "../../Thumbnail";
import FlexyInfo from "../../FlexyInfo";
import { shortenLocationName } from "../../../utils/helpers";

export default function DetailsContent({ feature }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <ListGroup variant="flush" className="px-3">
      <ListGroup.Item className="text-dts-dark-gray">
        <span className="fs-5 fw-bold me-2">
          {shortenLocationName(feature.properties.location_name)}
        </span>
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
          <Modal size="xl" animation={true} show={showModal} keyboard={false}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <Row className="justify-content-center">
                <Col xs={12} className="text-center">
                  <Thumbnail cameraId={feature.properties.camera_id} />
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
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
