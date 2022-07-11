import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { FaArrowAltCircleDown } from "react-icons/fa";
import IconLabel from "./IconLabel";

const LIST_ITEM_CHUNK_SIZE = 25;
const MIN_FEATURE_ZOOM_TO = 14;

const HiddenFeaturesItem = ({ hiddenCount, setLimit, limit }) => (
  <ListGroup.Item>
    <div className="d-flex justify-content-between align-items-center">
      <div className="small text-muted">
        {`${hiddenCount} more items not displayed`}
      </div>
      <div className="m-auto">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setLimit(limit + LIST_ITEM_CHUNK_SIZE)}
        >
          <IconLabel Icon={FaArrowAltCircleDown} label="Load more" />
        </Button>
      </div>
    </div>
  </ListGroup.Item>
);

export default function List({
  geojson,
  mapRef,
  setSelectedFeature,
  ListItemContent,
}) {
  const [limit, setLimit] = useState(LIST_ITEM_CHUNK_SIZE);
  return (
    <ListGroup variant="flush">
      {geojson &&
        geojson.features.slice(0, limit).map((feature, i) => (
          <ListGroup.Item
            action
            key={i}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedFeature(feature)}
          >
            <ListItemContent feature={feature} />
          </ListGroup.Item>
        ))}
      {geojson?.features.length > limit && (
        <HiddenFeaturesItem
          hiddenCount={geojson.features.length - limit}
          setLimit={setLimit}
          limit={limit}
        />
      )}
    </ListGroup>
  );
}
