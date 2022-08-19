import Modal from "react-bootstrap/Modal";

const FeatureModal = ({ selectedFeature, setSelectedFeature, children }) => (
  <Modal
    show={!!selectedFeature}
    onHide={() => setSelectedFeature(null)}
    animation={false}
    centered
  >
    <Modal.Header closeButton />
    {children}
  </Modal>
);

export default FeatureModal;
