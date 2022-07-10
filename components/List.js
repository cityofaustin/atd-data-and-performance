import ListGroup from "react-bootstrap/ListGroup";
const renderLimit = 100;

const HiddenFeaturesItem = ({ count }) => (
  <a
    key="hiddenFeatures"
    href="#"
    className="list-group-item list-group-item-action py-3 lh-tight"
  >
    <div className="col-10 mb-1 small">
      {`${count} more items not displayed. Use search to limit results.`}
    </div>
  </a>
);

export default function List({
  geojson,
  mapRef,
  setSelectedFeature,
  ListItemContent,
}) {
  return (
    <ListGroup variant="flush">
      {geojson &&
        geojson.features.slice(0, renderLimit).map((feature, i) => (
          <ListGroup.Item
            action
            key={i}
            style={{ cursor: "pointer" }}
            onClick={() => {
              mapRef.current.panTo(feature.geometry.coordinates);
              setSelectedFeature(feature);
            }}
          >
            <ListItemContent feature={feature} />
          </ListGroup.Item>
        ))}
      {geojson?.features.length > renderLimit && (
        <HiddenFeaturesItem count={geojson.features.length - renderLimit} />
      )}
    </ListGroup>
  );
}
